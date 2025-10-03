import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { StoryPreview } from './components/StoryPreview';
import type { Scene, ThemeKey, DrawingStyle, FontKey, Difficulty, AspectRatioKey, StoryData, Character, PdfLayoutKey } from './types';
import { generateImage, generateStoryText, generateCoverImage, generateSceneOutlines } from './services/geminiService';
import { generatePdf } from './utils/pdfGenerator';
import { themesData } from './themes';
import { fontsData } from './fonts';
import { difficultiesData } from './difficulties';
import { aspectRatiosData } from './aspectRatios';
import { PreviewModal } from './components/PreviewModal';
import { drawingStylesData } from './drawingStyles';
import { playSound } from './services/audioService';
import { LoginScreen } from './components/LoginScreen';
import { MobileNav } from './components/MobileNav';
import { HistoryModal } from './components/HistoryModal';
import { Footer } from './components/Footer';
import * as ttsService from './services/ttsService';
import { translations } from './translations';


// Session and storage keys
const AUTH_SESSION_KEY_ID = 'ai-storybook-auth-user-id';
const STORIES_KEY_PREFIX = 'ai-storybook-stories-';

// Define the default state for a new story
const defaultStoryData: Omit<StoryData, 'id' | 'lastModified'> = {
  scenes: [],
  storyTitle: '',
  characterDescription: '',
  characters: [],
  coverImageUrl: null,
  isAdultStory: false,
  theme: 'default',
  drawingStyle: 'storybook',
  customTextColor: themesData.default.colors.text,
  font: 'cairo',
  difficulty: 'medium',
  aspectRatio: 'landscape',
  writeTextOnImages: false,
  pdfLayout: 'classic',
  selectedVoiceURI: null,
  lang: 'ar',
};

const createNewStory = (lang: 'ar' | 'en'): StoryData => ({
  ...defaultStoryData,
  lang,
  id: `story-${Date.now()}`,
  lastModified: Date.now(),
});


// Function to safely get all stories from localStorage for a specific user.
const loadAllStories = (userId: string | null): StoryData[] => {
  if (!userId) return [];
  
  const key = `${STORIES_KEY_PREFIX}${userId}`;

  try {
    const savedStories = localStorage.getItem(key);
    if (savedStories) {
      const parsed = JSON.parse(savedStories);
      if (Array.isArray(parsed)) {
        // Migration: ensure all stories use the new `characters` structure
        const migratedStories = parsed.map(story => {
          const characters = (story.characters && Array.isArray(story.characters))
            ? story.characters
            : (story.characterNames && Array.isArray(story.characterNames))
              ? story.characterNames.map((name: string, index: number) => ({ id: `char-${story.id}-${index}`, name, description: '' }))
              : [];
          
          const newStory = {
            ...defaultStoryData, // provide defaults for any missing fields
            ...story,
            lang: story.lang || 'ar', // Default old stories to Arabic
            characters,
          };
          delete newStory.characterNames; // remove the old property
          return newStory;
        });

        return migratedStories.sort((a, b) => b.lastModified - a.lastModified);
      }
    }
  } catch (e) {
    console.error("Could not load stories from localStorage", e);
  }
  
  return [];
};

const curateVoices = (allVoices: SpeechSynthesisVoice[], lang: 'ar' | 'en'): SpeechSynthesisVoice[] => {
  const filteredVoices = allVoices.filter(voice => voice.lang.startsWith(lang));

  filteredVoices.sort((a, b) => {
    const aIsMicrosoft = a.name.toLowerCase().includes('microsoft');
    const bIsMicrosoft = b.name.toLowerCase().includes('microsoft');
    const aIsGoogle = a.name.toLowerCase().includes('google');
    const bIsGoogle = b.name.toLowerCase().includes('google');

    if ((aIsMicrosoft || aIsGoogle) && !(bIsMicrosoft || bIsGoogle)) return -1;
    if (!(aIsMicrosoft || aIsGoogle) && (bIsMicrosoft || bIsGoogle)) return 1;
    
    return a.name.localeCompare(b.name);
  });
  
  return filteredVoices;
};


const App: React.FC = () => {
  // Language and translation state
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const t = useCallback((key: keyof typeof translations.en, options?: Record<string, string | number>) => {
    let text = translations[language][key] || translations.en[key] || key;
    if (options) {
      Object.entries(options).forEach(([k, v]) => {
        text = text.replace(`{{${k}}}`, String(v));
      });
    }
    return text;
  }, [language]);
  
  // Authentication and user state
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Story state
  const [allStories, setAllStories] = useState<StoryData[]>([]);
  const [storyData, setStoryData] = useState<StoryData | null>(null); // The currently active story
  
  // Transient UI/session state
  const [currentDescription, setCurrentDescription] = useState<string>('');
  const [imagePrompts, setImagePrompts] = useState<{prompt1: string; prompt2: string}>({ prompt1: '', prompt2: ''});
  const [batchPrompt, setBatchPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(t('loadingMessageDefault'));
  const [isSuggestingText, setIsSuggestingText] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isGeneratingCover, setIsGeneratingCover] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewingScene, setPreviewingScene] = useState<Scene | null>(null);
  const [sceneLayout, setSceneLayout] = useState<'single' | 'split'>('single');
  const [generationMode, setGenerationMode] = useState<'single' | 'batch' | 'batch10'>('single');
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Narration State
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [isNarrationPaused, setIsNarrationPaused] = useState<boolean>(false);
  const [narratingSceneId, setNarratingSceneId] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPreviewingVoice, setIsPreviewingVoice] = useState<boolean>(false);

  // Effect to manage document direction and language attributes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.remove('font-cairo', 'font-lato');
    document.body.classList.add(language === 'ar' ? 'font-cairo' : 'font-lato');
    document.title = t('appTitle');
  }, [language, t]);

  // Sync app language with the current story's language
  useEffect(() => {
    if (storyData?.lang) {
      setLanguage(storyData.lang);
    }
  }, [storyData?.id, storyData?.lang]);

  // Effect to check for an active session on initial load and load TTS voices
  useEffect(() => {
    try {
      const sessionUserId = sessionStorage.getItem(AUTH_SESSION_KEY_ID);
      if (sessionUserId) {
        handleLoginSuccess(sessionUserId);
      }
    } catch (e) {
      console.error("Could not read session state", e);
    }
    
    // Set up the event listener for browsers that load voices asynchronously
    const onVoicesChangedCallback = () => {
         const allVoices = ttsService.getVoices();
         if (storyData?.lang) {
           setAvailableVoices(curateVoices(allVoices, storyData.lang));
         } else {
           setAvailableVoices(curateVoices(allVoices, 'ar'));
         }
    };
    ttsService.onVoicesChanged(onVoicesChangedCallback);
    
    // Call it once to catch browsers that load voices immediately
    setTimeout(onVoicesChangedCallback, 100);

    // Stop any narration when the component unmounts
    return () => {
      ttsService.stop();
    };
  }, []); // Run only once

  // Re-filter voices when the story language changes
  useEffect(() => {
    if (storyData?.lang) {
      const allVoices = ttsService.getVoices();
      setAvailableVoices(curateVoices(allVoices, storyData.lang));
    }
  }, [storyData?.lang]);


  // Effect to save all stories when the active story data changes
  useEffect(() => {
    if (!isVerified || !userId || !storyData) return;

    const saveCurrentStory = () => {
        setAllStories(currentStories => {
            const storyIndex = currentStories.findIndex(s => s.id === storyData.id);
            let updatedStories;

            if (storyIndex !== -1) {
                updatedStories = [...currentStories];
                updatedStories[storyIndex] = storyData;
            } else {
                updatedStories = [storyData, ...currentStories];
            }
            updatedStories.sort((a, b) => b.lastModified - a.lastModified);

            try {
                localStorage.setItem(`${STORIES_KEY_PREFIX}${userId}`, JSON.stringify(updatedStories));
            } catch (e) {
                console.error("Could not save stories to localStorage", e);
            }

            return updatedStories;
        });
    };
    
    const timer = setTimeout(saveCurrentStory, 1000); // Debounce for 1 second
    return () => clearTimeout(timer);

  }, [storyData, userId, isVerified]);

  const resetTransientState = () => {
    setCurrentDescription('');
    setImagePrompts({ prompt1: '', prompt2: '' });
    setBatchPrompt('');
    setError(null);
  };
  
  const handleError = useCallback((error: unknown) => {
    const message = error instanceof Error ? error.message : t('errorUnknown');
    setError(message);
    playSound('error');
  }, [t]);
  
  const resetNarrationState = () => {
      setIsNarrating(false);
      setIsNarrationPaused(false);
      setNarratingSceneId(null);
  }

  const handleLoginSuccess = (loggedInUserId: string) => {
    try {
      sessionStorage.setItem(AUTH_SESSION_KEY_ID, loggedInUserId);
    } catch (e) {
      console.error("Could not save session state", e);
    }
    setUserId(loggedInUserId);
    setIsVerified(true);
    const stories = loadAllStories(loggedInUserId);
    setAllStories(stories);

    if (stories.length > 0) {
      setStoryData(stories[0]); // Load the most recently modified story
    } else {
      const newStory = createNewStory(language);
      setStoryData(newStory);
      setAllStories([newStory]);
    }
  };

  const handleLogout = () => {
      ttsService.stop();
      resetNarrationState();
      setUserId(null);
      setIsVerified(false);
      setStoryData(null);
      setAllStories([]);
      resetTransientState();
      
      try {
        sessionStorage.removeItem(AUTH_SESSION_KEY_ID);
      } catch (e) {
        console.error("Could not clear session storage", e);
      }
      playSound('delete');
  };

  const handleNewStory = () => {
    ttsService.stop();
    resetNarrationState();
    const newStory = createNewStory(language);
    setStoryData(newStory);
    resetTransientState();
    setIsHistoryOpen(false);
    setActiveTab('form');
    playSound('addScene');
  };
  
  const handleLoadStory = (storyToLoad: StoryData) => {
    ttsService.stop();
    resetNarrationState();
    setStoryData(storyToLoad);
    resetTransientState();
    setIsHistoryOpen(false);
    setActiveTab('form');
    playSound('open');
  };

  const buildFullPrompt = useCallback((prompt: string) => {
       if (!storyData) return '';
       const { characterDescription, characters, drawingStyle, difficulty, isAdultStory } = storyData;
       
       const secondaryCharsString = characters.length > 0
         ? `The secondary characters are: ${characters.map(c => `${c.name.trim()} (${c.description.trim()})`).join('; ')}. `
         : '';

       const corePrompt = characterDescription.trim()
        ? `Main character(s) description: ${characterDescription.trim()}. ${secondaryCharsString}Scene description: ${prompt}`
        : `${secondaryCharsString}${prompt}`;
      
      const styleDef = drawingStylesData[drawingStyle];
      const difficultyDef = difficultiesData[difficulty];
      
      let finalPrompt = `${styleDef.promptParts.prefix}${corePrompt}${styleDef.promptParts.suffix}`;
      
      if (difficultyDef.promptSuffix.trim()) {
        finalPrompt += ` ${difficultyDef.promptSuffix.trim()}`;
      }

      if (isAdultStory) {
        finalPrompt = `For a story aimed at adults, emphasizing a more mature and serious tone. May include non-graphic conflict or dramatic situations. ${finalPrompt}`;
      } else {
        finalPrompt = `For a children's story. Ensure the image is safe, friendly, and appropriate for all ages. ${finalPrompt}`;
      }
      return finalPrompt;
    }, [storyData]);

  const handleAddSingleScene = useCallback(async () => {
    if (!storyData) return;
    const { scenes, storyTitle, aspectRatio, characterDescription, writeTextOnImages, lang } = storyData;
    const isSplit = sceneLayout === 'split';
    const hasMainPrompt = imagePrompts.prompt1.trim();
    const hasSecondPrompt = imagePrompts.prompt2.trim();
    const hasAllPrompts = isSplit ? (hasMainPrompt && hasSecondPrompt) : hasMainPrompt;

    if (!hasAllPrompts || !currentDescription.trim() || !storyTitle.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const lastScene = scenes.length > 0 ? scenes[scenes.length - 1] : null;
      const lastImageUrl = lastScene ? lastScene.imageUrls[lastScene.imageUrls.length - 1] : undefined;
      const aspectRatioValue = aspectRatiosData[aspectRatio].value;
      const imageUrls: string[] = [];

      setLoadingMessage(isSplit ? t('loadingMessageImage1') : t('loadingMessageDefault'));
      const finalPrompt1 = buildFullPrompt(imagePrompts.prompt1);
      const shouldWriteOnImage = sceneLayout === 'single' && writeTextOnImages;

      const imageUrl1 = await generateImage(finalPrompt1, aspectRatioValue, characterDescription, shouldWriteOnImage, currentDescription, lang, lastImageUrl);
      imageUrls.push(imageUrl1);

      if (isSplit) {
        setLoadingMessage(t('loadingMessageImage2'));
        const finalPrompt2 = buildFullPrompt(imagePrompts.prompt2);
        const imageUrl2 = await generateImage(finalPrompt2, aspectRatioValue, characterDescription, false, undefined, lang, imageUrl1);
        imageUrls.push(imageUrl2);
      }

      const newScene: Scene = {
        id: new Date().toISOString(),
        description: currentDescription,
        imageUrls,
      };

      let newCoverUrl = storyData.coverImageUrl;
      if (scenes.length === 0) {
        setLoadingMessage(t('loadingMessageCover'));
        newCoverUrl = await generateCoverImage(storyTitle, newScene.imageUrls[0], writeTextOnImages, lang);
      }

      setStoryData(prev => prev ? {
        ...prev,
        scenes: [...prev.scenes, newScene],
        coverImageUrl: newCoverUrl,
        lastModified: Date.now(),
      } : null);
      
      setActiveTab('preview');
      playSound('addScene');
      setCurrentDescription('');
      setImagePrompts({ prompt1: '', prompt2: '' });

    } catch (e) {
      handleError(e);
    } finally {
      setIsLoading(false);
      setLoadingMessage(t('loadingMessageDefault'));
    }
  }, [storyData, currentDescription, imagePrompts, sceneLayout, buildFullPrompt, handleError, t]);
  
  const handleAddBatchScenes = useCallback(async () => {
    if (!storyData) return;
    const { storyTitle, characterDescription, characters, difficulty, isAdultStory, scenes, aspectRatio, writeTextOnImages, lang } = storyData;
    if (!batchPrompt.trim() || !storyTitle.trim()) return;

    setIsLoading(true);
    setError(null);

    const numberOfScenes = generationMode === 'batch' ? 5 : 10;

    try {
      setLoadingMessage(t('loadingMessageBatchPlan', { count: numberOfScenes }));
      const sceneOutlines = await generateSceneOutlines(batchPrompt, storyTitle, characterDescription, characters, difficulty, isAdultStory, numberOfScenes, lang);

      if (!sceneOutlines || sceneOutlines.length === 0) {
        throw new Error(t('errorBatchNoScenes'));
      }

      const newScenesBatch: Scene[] = [];
      const lastScene = scenes.length > 0 ? scenes[scenes.length - 1] : null;
      let batchReferenceImage = lastScene ? lastScene.imageUrls[lastScene.imageUrls.length - 1] : undefined;
      const aspectRatioValue = aspectRatiosData[aspectRatio].value;

      for (let i = 0; i < sceneOutlines.length; i++) {
        const outline = sceneOutlines[i];
        setLoadingMessage(t('loadingMessageBatchGenerate', { current: i + 1, total: sceneOutlines.length }));
        
        const fullImagePrompt = buildFullPrompt(outline.imagePrompt);
        
        const imageUrl = await generateImage(fullImagePrompt, aspectRatioValue, characterDescription, writeTextOnImages, outline.storyText, lang, batchReferenceImage);

        const newScene: Scene = {
          id: new Date().toISOString() + `-${i}`,
          description: outline.storyText,
          imageUrls: [imageUrl],
        };
        
        newScenesBatch.push(newScene);
        
        // Use the first generated image of the batch as reference for subsequent images in the same batch
        if (i === 0 && !batchReferenceImage) {
          batchReferenceImage = imageUrl;
        } else {
          batchReferenceImage = imageUrl;
        }

        if (i < sceneOutlines.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      let newCoverUrl = storyData.coverImageUrl;
      if (scenes.length === 0 && newScenesBatch.length > 0) {
        setLoadingMessage(t('loadingMessageCover'));
        newCoverUrl = await generateCoverImage(storyTitle, newScenesBatch[0].imageUrls[0], writeTextOnImages, lang);
      }

      setStoryData(prev => prev ? {
          ...prev,
          scenes: [...prev.scenes, ...newScenesBatch],
          coverImageUrl: newCoverUrl,
          lastModified: Date.now(),
      } : null);
      setBatchPrompt('');
      setActiveTab('preview');
      playSound('addScene');
    } catch (e) {
      handleError(e);
    } finally {
      setIsLoading(false);
      setLoadingMessage(t('loadingMessageDefault'));
    }
  }, [batchPrompt, storyData, buildFullPrompt, generationMode, handleError, t]);

  const handleSubmit = useCallback(() => {
    if (generationMode === 'single') {
      handleAddSingleScene();
    } else {
      handleAddBatchScenes();
    }
  }, [generationMode, handleAddSingleScene, handleAddBatchScenes]);
  
  const handleStopStory = useCallback(() => {
      ttsService.stop();
      resetNarrationState();
      playSound('delete');
  }, []);

  const handleDeleteScene = useCallback((sceneId: string) => {
    if (narratingSceneId === sceneId) {
        handleStopStory();
    }
    if (!storyData) return;
    const newScenes = storyData.scenes.filter((scene) => scene.id !== sceneId);
    setStoryData(prev => prev ? {
        ...prev,
        scenes: newScenes,
        coverImageUrl: newScenes.length === 0 ? null : prev.coverImageUrl,
        lastModified: Date.now(),
    } : null);
    playSound('delete');
  }, [storyData, narratingSceneId, handleStopStory]);
  
  const handlePreviewScene = useCallback((scene: Scene) => {
    setPreviewingScene(scene);
    playSound('open');
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewingScene(null);
    playSound('close');
  }, []);
  
  const handleSuggestText = useCallback(async () => {
    if (!storyData) return;
    const { storyTitle, difficulty, isAdultStory, characters, lang } = storyData;
    if (!imagePrompts.prompt1.trim()) {
      setError(t('errorSuggestText'));
      playSound('error');
      return;
    }
    
    setIsSuggestingText(true);
    setError(null);
    playSound('suggest');
    
    try {
      const suggestedText = await generateStoryText(imagePrompts.prompt1, storyTitle, difficulty, isAdultStory, characters, lang);
      setCurrentDescription(suggestedText);
    } catch (e) {
      handleError(e);
    } finally {
      setIsSuggestingText(false);
    }
  }, [imagePrompts.prompt1, storyData, handleError, t]);

  const handleExportPdf = useCallback(async () => {
    if (!storyData) return;
    const { scenes, storyTitle, theme, customTextColor, font, coverImageUrl, pdfLayout, lang } = storyData;
    if (scenes.length === 0) {
      alert(t('errorExportNoScenes'));
      playSound('error');
      return;
    }
    setIsExportingPdf(true);
    playSound('export');
    try {
      const selectedFontFamily = fontsData[font].family;
      await generatePdf(scenes, storyTitle, theme, customTextColor, selectedFontFamily, coverImageUrl, pdfLayout, lang);
    } catch (e: any) {
      console.error("PDF generation failed:", e);
      alert(t('errorPdfGeneration'));
      playSound('error');
    } finally {
      setIsExportingPdf(false);
    }
  }, [storyData, t]);

  const handleGenerateCover = useCallback(async () => {
    if (!storyData || storyData.scenes.length === 0) {
      setError(t('errorGenerateCover'));
      playSound('error');
      return;
    }
    
    setIsGeneratingCover(true);
    setError(null);
    playSound('suggest');
    
    try {
      const { storyTitle, scenes, writeTextOnImages, lang } = storyData;
      const referenceImageUrl = scenes[0].imageUrls[0];
      const newCoverUrl = await generateCoverImage(storyTitle, referenceImageUrl, writeTextOnImages, lang);
      setStoryData(prev => prev ? {
        ...prev,
        coverImageUrl: newCoverUrl,
        lastModified: Date.now(),
      } : null);
      playSound('addScene');
    } catch (e) {
      handleError(e);
    } finally {
      setIsGeneratingCover(false);
    }
  }, [storyData, handleError, t]);

  const handleThemeChange = (newTheme: ThemeKey) => {
    playSound('click');
    setStoryData(prev => prev ? {
        ...prev,
        theme: newTheme,
        customTextColor: themesData[newTheme].colors.text,
        lastModified: Date.now(),
    } : null);
  };
  
  const handleSceneFeedback = useCallback((sceneId: string, rating: 'up' | 'down' | null, comment: string) => {
    setStoryData(prev => {
        if (!prev) return null;
        const newScenes = prev.scenes.map(scene => {
            if (scene.id === sceneId) {
                return {
                    ...scene,
                    feedback: { rating, comment }
                };
            }
            return scene;
        });
        return { ...prev, scenes: newScenes, lastModified: Date.now() };
    });
    playSound('click');
  }, []);

  const handleDeleteStory = useCallback((storyIdToDelete: string) => {
      setAllStories(prevStories => {
          const updatedStories = prevStories.filter(story => story.id !== storyIdToDelete);
          try {
              if (userId) {
                  localStorage.setItem(`${STORIES_KEY_PREFIX}${userId}`, JSON.stringify(updatedStories));
              }
          } catch (e) {
              console.error("Could not save updated stories to localStorage after deletion", e);
          }
          
          if (storyData?.id === storyIdToDelete) {
              if (updatedStories.length > 0) {
                  setStoryData(updatedStories[0]);
              } else {
                  // If the last story is deleted, create a new one to become the active story.
                  // The `useEffect` that saves `storyData` will then persist this new story.
                  const newStory = createNewStory(language);
                  setStoryData(newStory);
              }
          }

          // Always return the list of stories *after* the deletion.
          // If the last story was deleted, this will correctly be an empty array.
          return updatedStories;
      });
      playSound('delete');
  }, [userId, storyData, language]);

  const handlePlayStory = useCallback(() => {
    if (!storyData || storyData.scenes.length === 0) return;
    
    if (isNarrationPaused) {
      ttsService.resume();
      setIsNarrationPaused(false);
      playSound('click');
      return;
    }
    
    setIsNarrating(true);
    setIsNarrationPaused(false);
    playSound('open');
    
    ttsService.start({
        scenes: storyData.scenes,
        voiceURI: storyData.selectedVoiceURI,
        lang: storyData.lang,
        onSceneStart: (sceneId) => {
            setNarratingSceneId(sceneId);
        },
        onStoryEnd: () => {
            resetNarrationState();
            playSound('close');
        },
        onError: (error) => {
            handleError(new Error(`Speech synthesis failed: ${error}`));
            resetNarrationState();
        }
    });
  }, [storyData, isNarrationPaused, handleError]);

  const handlePauseStory = useCallback(() => {
      ttsService.pause();
      setIsNarrationPaused(true);
      playSound('click');
  }, []);

  const handlePreviewVoice = useCallback((voiceURI: string) => {
      if (!storyData) return;
      setIsPreviewingVoice(true);
      playSound('click');
      ttsService.previewVoice(voiceURI, storyData.lang, () => {
        setIsPreviewingVoice(false);
      });
  }, [storyData?.lang]);

  const handleSetLanguage = useCallback((lang: 'ar' | 'en') => {
      setLanguage(lang);
      if (storyData) {
        setStoryData(prev => prev ? {...prev, lang, lastModified: Date.now()} : null);
      }
  }, [storyData]);


  return (
    <div 
      className="min-h-screen flex flex-col"
    >
      {!isVerified && <LoginScreen onLoginSuccess={handleLoginSuccess} t={t} />}
      <Header 
        isVerified={isVerified}
        onLogout={handleLogout}
        onNewStory={handleNewStory}
        onOpenHistory={() => setIsHistoryOpen(true)}
        username={userId}
        language={language}
        setLanguage={handleSetLanguage}
        t={t}
      />
      <main className="container mx-auto px-4 pb-24 lg:pb-8 flex-grow">
        {isVerified && storyData && (
          <>
            {/* Desktop Layout: Grid */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                <InputForm
                  storyTitle={storyData.storyTitle}
                  onStoryTitleChange={(title) => setStoryData(p => p ? {...p, storyTitle: title, lastModified: Date.now()} : p)}
                  characterDescription={storyData.characterDescription}
                  onCharacterDescriptionChange={(desc) => setStoryData(p => p ? {...p, characterDescription: desc, lastModified: Date.now()} : p)}
                  characters={storyData.characters}
                  onCharactersChange={(chars) => setStoryData(p => p ? {...p, characters: chars, lastModified: Date.now()} : p)}
                  isAdultStory={storyData.isAdultStory}
                  onIsAdultStoryChange={(isAdult) => setStoryData(p => p ? {...p, isAdultStory: isAdult, lastModified: Date.now()} : p)}
                  currentDescription={currentDescription}
                  onCurrentDescriptionChange={setCurrentDescription}
                  imagePrompts={imagePrompts}
                  onImagePromptsChange={setImagePrompts}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  selectedTheme={storyData.theme}
                  onThemeChange={handleThemeChange}
                  selectedStyle={storyData.drawingStyle}
                  onStyleChange={(style) => setStoryData(p => p ? {...p, drawingStyle: style, lastModified: Date.now()} : p)}
                  customTextColor={storyData.customTextColor}
                  onCustomTextColorChange={(color) => setStoryData(p => p ? {...p, customTextColor: color, lastModified: Date.now()} : p)}
                  selectedFont={storyData.font}
                  onFontChange={(font) => setStoryData(p => p ? {...p, font: font, lastModified: Date.now()} : p)}
                  selectedDifficulty={storyData.difficulty}
                  onDifficultyChange={(difficulty) => setStoryData(p => p ? {...p, difficulty: difficulty, lastModified: Date.now()} : p)}
                  selectedAspectRatio={storyData.aspectRatio}
                  onAspectRatioChange={(aspect) => setStoryData(p => p ? {...p, aspectRatio: aspect, lastModified: Date.now()} : p)}
                  writeTextOnImages={storyData.writeTextOnImages}
                  onWriteTextOnImagesChange={(write) => setStoryData(p => p ? {...p, writeTextOnImages: write, lastModified: Date.now()} : p)}
                  selectedPdfLayout={storyData.pdfLayout}
                  onPdfLayoutChange={(layout) => setStoryData(p => p ? {...p, pdfLayout: layout, lastModified: Date.now()} : p)}
                  error={error}
                  onSuggestText={handleSuggestText}
                  isSuggestingText={isSuggestingText}
                  scenesCount={storyData.scenes.length}
                  sceneLayout={sceneLayout}
                  onSceneLayoutChange={setSceneLayout}
                  generationMode={generationMode}
                  onGenerationModeChange={setGenerationMode}
                  batchPrompt={batchPrompt}
                  onBatchPromptChange={setBatchPrompt}
                  availableVoices={availableVoices}
                  selectedVoiceURI={storyData.selectedVoiceURI}
                  onSelectedVoiceURIChange={(uri) => setStoryData(p => p ? {...p, selectedVoiceURI: uri, lastModified: Date.now()} : p)}
                  onPreviewVoice={handlePreviewVoice}
                  isPreviewingVoice={isPreviewingVoice}
                  disabled={!isVerified}
                  lang={language}
                  t={t}
                />
                <StoryPreview
                  scenes={storyData.scenes}
                  onExport={handleExportPdf}
                  isLoading={isLoading}
                  loadingMessage={loadingMessage}
                  isExportingPdf={isExportingPdf}
                  storyTitle={storyData.storyTitle}
                  coverImageUrl={storyData.coverImageUrl}
                  onDeleteScene={handleDeleteScene}
                  onPreviewScene={handlePreviewScene}
                  onGenerateCover={handleGenerateCover}
                  isGeneratingCover={isGeneratingCover}
                  disabled={!isVerified}
                  isNarrating={isNarrating}
                  isNarrationPaused={isNarrationPaused}
                  narratingSceneId={narratingSceneId}
                  onPlayStory={handlePlayStory}
                  onPauseStory={handlePauseStory}
                  onStopStory={handleStopStory}
                  t={t}
                />
            </div>

            {/* Mobile Layout: Tabs */}
            <div className="lg:hidden h-full">
                {activeTab === 'form' && (
                  <InputForm
                    storyTitle={storyData.storyTitle}
                    onStoryTitleChange={(title) => setStoryData(p => p ? {...p, storyTitle: title, lastModified: Date.now()} : p)}
                    characterDescription={storyData.characterDescription}
                    onCharacterDescriptionChange={(desc) => setStoryData(p => p ? {...p, characterDescription: desc, lastModified: Date.now()} : p)}
                    characters={storyData.characters}
                    onCharactersChange={(chars) => setStoryData(p => p ? {...p, characters: chars, lastModified: Date.now()} : p)}
                    isAdultStory={storyData.isAdultStory}
                    onIsAdultStoryChange={(isAdult) => setStoryData(p => p ? {...p, isAdultStory: isAdult, lastModified: Date.now()} : p)}
                    currentDescription={currentDescription}
                    onCurrentDescriptionChange={setCurrentDescription}
                    imagePrompts={imagePrompts}
                    onImagePromptsChange={setImagePrompts}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    selectedTheme={storyData.theme}
                    onThemeChange={handleThemeChange}
                    selectedStyle={storyData.drawingStyle}
                    onStyleChange={(style) => setStoryData(p => p ? {...p, drawingStyle: style, lastModified: Date.now()} : p)}
                    customTextColor={storyData.customTextColor}
                    onCustomTextColorChange={(color) => setStoryData(p => p ? {...p, customTextColor: color, lastModified: Date.now()} : p)}
                    selectedFont={storyData.font}
                    onFontChange={(font) => setStoryData(p => p ? {...p, font: font, lastModified: Date.now()} : p)}
                    selectedDifficulty={storyData.difficulty}
                    onDifficultyChange={(difficulty) => setStoryData(p => p ? {...p, difficulty: difficulty, lastModified: Date.now()} : p)}
                    selectedAspectRatio={storyData.aspectRatio}
                    onAspectRatioChange={(aspect) => setStoryData(p => p ? {...p, aspectRatio: aspect, lastModified: Date.now()} : p)}
                    writeTextOnImages={storyData.writeTextOnImages}
                    onWriteTextOnImagesChange={(write) => setStoryData(p => p ? {...p, writeTextOnImages: write, lastModified: Date.now()} : p)}
                    selectedPdfLayout={storyData.pdfLayout}
                    onPdfLayoutChange={(layout) => setStoryData(p => p ? {...p, pdfLayout: layout, lastModified: Date.now()} : p)}
                    error={error}
                    onSuggestText={handleSuggestText}
                    isSuggestingText={isSuggestingText}
                    scenesCount={storyData.scenes.length}
                    sceneLayout={sceneLayout}
                    onSceneLayoutChange={setSceneLayout}
                    generationMode={generationMode}
                    onGenerationModeChange={setGenerationMode}
                    batchPrompt={batchPrompt}
                    onBatchPromptChange={setBatchPrompt}
                    availableVoices={availableVoices}
                    selectedVoiceURI={storyData.selectedVoiceURI}
                    onSelectedVoiceURIChange={(uri) => setStoryData(p => p ? {...p, selectedVoiceURI: uri, lastModified: Date.now()} : p)}
                    onPreviewVoice={handlePreviewVoice}
                    isPreviewingVoice={isPreviewingVoice}
                    disabled={!isVerified}
                    lang={language}
                    t={t}
                  />
                )}
                {activeTab === 'preview' && (
                  <StoryPreview
                    scenes={storyData.scenes}
                    onExport={handleExportPdf}
                    isLoading={isLoading}
                    loadingMessage={loadingMessage}
                    isExportingPdf={isExportingPdf}
                    storyTitle={storyData.storyTitle}
                    coverImageUrl={storyData.coverImageUrl}
                    onDeleteScene={handleDeleteScene}
                    onPreviewScene={handlePreviewScene}
                    onGenerateCover={handleGenerateCover}
                    isGeneratingCover={isGeneratingCover}
                    disabled={!isVerified}
                    isNarrating={isNarrating}
                    isNarrationPaused={isNarrationPaused}
                    narratingSceneId={narratingSceneId}
                    onPlayStory={handlePlayStory}
                    onPauseStory={handlePauseStory}
                    onStopStory={handleStopStory}
                    t={t}
                  />
                )}
            </div>
          </>
        )}
      </main>
      {isVerified && storyData && (
        <MobileNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          scenesCount={storyData.scenes.length}
          t={t}
        />
      )}
      <PreviewModal scene={previewingScene} onClose={handleClosePreview} onFeedbackSubmit={handleSceneFeedback} t={t}/>
      <HistoryModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={allStories}
        onLoadStory={handleLoadStory}
        onDeleteStory={handleDeleteStory}
        t={t}
        lang={language}
      />
      <Footer t={t}/>
    </div>
  );
};

export default App;