"use client";

import React, { useState, useEffect, useRef } from "react";
import Pagination from "@/components/ui/Pagination";
import { BookOpen, Volume2, ChevronDown } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { useGetAllVocabularyPublicQuery } from "@/src/redux/api/home/freeResourcesPublicApi";
import VocabularyCard from "./_components/VocabularyCard";

const VocabularyPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(16);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load available voices globally
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
      setAvailableVoices(englishVoices);
      
      // Priority: Google voices first, then female voices
      const googleVoice = englishVoices.find(voice => 
        voice.name.includes('Google') && voice.name.includes('English')
      );
      
      const femaleVoice = englishVoices.find(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('karen')
      );
      
      // Set default voice: Google voice > Female voice > First available
      setSelectedVoice(googleVoice || femaleVoice || englishVoices[0] || null);
    };

    if (typeof window !== 'undefined') {
      if (window.speechSynthesis.getVoices().length) {
        loadVoices();
      }
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowVoiceDropdown(false);
      }
    };

    // Add event listener when dropdown is open
    if (showVoiceDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVoiceDropdown]);

  // Get simplified voice name (first name only)
  const getSimpleVoiceName = (voiceName: string) => {
    const nameMap: Record<string, string> = {
      'Google UK English Female': 'Sara (Google)',
      'Google US English Female': 'Emma (Google)',
      'Google UK English Male': 'James (Google)',
      'Samantha': 'Samantha',
      'Microsoft Zira': 'Zira',
      'Microsoft David': 'David',
      'Microsoft Mark': 'Mark',
      'Karen': 'Karen',
      'Moira': 'Moira',
      'Rishi': 'Rishi',
    };
    
    for (const [key, value] of Object.entries(nameMap)) {
      if (voiceName.includes(key)) {
        return value;
      }
    }
    
    return voiceName.split(' ')[0];
  };

  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useGetAllVocabularyPublicQuery({
    page: currentPage,
    per_page: itemsPerPage,
  });

  const vocabularies = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;
  const totalItems = pagination?.total || 0;
  const totalPages = pagination?.last_page || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Failed to load vocabulary
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-350 mx-auto px-4 md:px-6 lg:px-8 py-12" id="vocabulary-top">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-2xl mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Vocabulary Collection
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Expand your English vocabulary with our curated collection of words, meanings, and examples
          </p>
        </div>

        {/* Stats Bar with Voice Selector */}
        {totalItems > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {totalItems} vocabulary words available
                </span>
              </div>
              
              {/* Voice Selector Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowVoiceDropdown(!showVoiceDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-200 text-sm font-medium text-primary cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>
                    Voice: {selectedVoice ? getSimpleVoiceName(selectedVoice.name) : 'Default'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showVoiceDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Voice Dropdown Menu */}
                {showVoiceDropdown && availableVoices.length > 0 && (
                  <div className="absolute top-full right-0 mt-2 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-56 overflow-y-auto">
                    <div className="p-1">
                      {availableVoices.map((voice, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedVoice(voice);
                            setShowVoiceDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                            selectedVoice?.name === voice.name
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="font-medium">{getSimpleVoiceName(voice.name)}</div>
                          <div className="text-gray-400 text-xs">{voice.lang}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Vocabulary Cards Grid */}
        {vocabularies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No vocabulary found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for new words!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {vocabularies.map((vocabulary: any) => (
              <VocabularyCard 
                key={vocabulary.id} 
                vocabulary={vocabulary}
                selectedVoice={selectedVoice}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              scrollOnChange={true}
              scrollTargetId="vocabulary-top"
              scrollOffset={80}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyPage;