// src/app/page.js
'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import ChatInterface from '@/components/chat/ChatInterface';
import ResultsPanel from '@/components/results/ResultsPanel';
import Sidebar from '@/components/layout/Sidebar';

export default function Home() {
  const [queryResults, setQueryResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSearch = async (query, context = {}) => {
    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual API endpoint
      setTimeout(() => {
        const mockResults = {
          answer: "Based on current orthopedic research, the most effective treatment for ACL tears depends on the patient's activity level and the extent of the injury. For young, active patients, surgical reconstruction using a patellar tendon or hamstring autograft is often recommended. For less active patients, conservative treatment with physical therapy may be sufficient.",
          sources: [
            {
              id: 1,
              title: "ACL Reconstruction Techniques: A Comprehensive Review",
              authors: "Smith, J., Johnson, A., & Williams, R.",
              journal: "Journal of Orthopedic Surgery",
              year: 2023,
              volume: "15",
              issue: "2",
              pages: "112-125",
              url: "#",
              relevance: 0.95,
              excerpt: "Our meta-analysis of 35 studies found that autograft reconstruction resulted in significantly better outcomes for young athletes compared to allografts or conservative treatment."
            },
            {
              id: 2,
              title: "Rehabilitation Protocols Following ACL Reconstruction",
              authors: "Chen, L., Martinez, K., & Brown, T.",
              journal: "Clinical Orthopedics and Related Research",
              year: 2022,
              volume: "480",
              issue: "5",
              pages: "892-905",
              url: "#",
              relevance: 0.87,
              excerpt: "Early weight-bearing and controlled motion exercises initiated within the first two weeks post-surgery showed improved range of motion outcomes without compromising graft integrity."
            }
          ],
          confidence: 0.92,
          suggestedQuestions: [
            "What are the success rates of different ACL graft types?",
            "How long is the recovery period after ACL reconstruction?",
            "What are the common complications of ACL surgery?"
          ]
        };
        
        setQueryResults(mockResults);
        setIsLoading(false);
        
        // Add to chat history
        setChatHistory(prev => [...prev, {
          id: Date.now(),
          query,
          response: mockResults,
          timestamp: new Date().toISOString()
        }]);
      }, 1500);
    } catch (error) {
      console.error('Search error:', error);
      setIsLoading(false);
    }
  };

  return (
    <main className="main-content">
      <Header 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        sidebarOpen={sidebarOpen}
      />
      
      <div className="content-wrapper">
        <Sidebar 
          isOpen={sidebarOpen} 
          chatHistory={chatHistory}
          onSelectChat={(chat) => setQueryResults(chat.response)}
        />
        
        <div className="main-panel">
          <ChatInterface 
            onSearch={handleSearch}
            isLoading={isLoading}
            suggestedQuestions={queryResults?.suggestedQuestions || []}
          />
          
          {queryResults && (
            <ResultsPanel 
              results={queryResults}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </main>
  );
}