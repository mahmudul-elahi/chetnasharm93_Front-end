"use client";

import React, { useState } from "react";
import { BookOpen, Volume2, Mic, Check, Copy, Languages } from "lucide-react";

interface VocabularyCardProps {
  vocabulary: {
    id: number;
    word: string;
    meaning: string;
    example: string;
    pronunciation: string;
    part_of_speech: string;
    image_url: string | null;
  };
  selectedVoice: SpeechSynthesisVoice | null;
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({ vocabulary, selectedVoice }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Text-to-speech function using global selected voice
  const speakWord = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(vocabulary.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // Copy word to clipboard
  const copyWord = async () => {
    try {
      await navigator.clipboard.writeText(vocabulary.word);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getPartOfSpeechColor = (partOfSpeech: string) => {
    const colors: Record<string, string> = {
      Noun: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      Pronoun: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      Verb: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      Adjective: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      Adverb: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      Preposition: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
      Conjunction: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
      Interjection: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    };
    return colors[partOfSpeech] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:-translate-y-1 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-linear-to-br from-primary/5 to-secondary/5 shrink-0">
        {vocabulary.image_url ? (
          <img
            src={vocabulary.image_url}
            alt={vocabulary.word}
            className="w-full h-full object-cover transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Languages className="w-16 h-16 text-primary/30" />
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPartOfSpeechColor(vocabulary.part_of_speech)}`}>
            {vocabulary.part_of_speech}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col grow">
        {/* Word Header */}
        <div className="flex items-start justify-between mb-4 gap-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors flex-1">
            {vocabulary.word}
          </h3>
          
          <div className="flex gap-1">
            {/* Copy Button */}
            <button
              onClick={copyWord}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer"
              aria-label={`Copy ${vocabulary.word}`}
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
            
            {/* Pronounce Button */}
            <button
              onClick={speakWord}
              disabled={isSpeaking}
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label={`Pronounce ${vocabulary.word}`}
            >
              <Volume2 className={`w-4 h-4 text-primary ${isSpeaking ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </div>

        {/* Meaning Section */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Meaning:</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {vocabulary.meaning}
          </p>
        </div>

        {/* Example Section */}
        {vocabulary.example && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">Example:</span>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed">
                "{vocabulary.example}"
              </p>
            </div>
          </div>
        )}

        {/* Pronunciation Section */}
        {vocabulary.pronunciation && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">Pronunciation:</span>
            </div>
            <div className="flex items-center gap-2">
              <Mic className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {vocabulary.pronunciation}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyCard;