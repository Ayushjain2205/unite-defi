'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrbIcon } from '@/components/ui/orb-icon';
import { useOrbStore } from '@/lib/store';
import { Play, RotateCcw, Rocket, Save, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Dynamic import for client-side only rendering
const BlocklyEditor = dynamic(() => import('@/components/blockly-editor').then(mod => ({ default: mod.BlocklyEditor })), {
  ssr: false,
  loading: () => <div className="h-[600px] flex items-center justify-center border-2 border-gray-200 rounded-lg">Loading visual editor...</div>
});

export default function VisualBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt') || '';
  
  const { createDraft, updateDraft, publishOrb } = useOrbStore();
  const [orbName, setOrbName] = useState(`Trading Bot ${Date.now().toString().slice(-4)}`);
  const [currentBlocks, setCurrentBlocks] = useState<string>('');
  const [selectedEpoch, setSelectedEpoch] = useState<string>('15');
  
  const handleSaveDraft = () => {
    const draftId = createDraft(prompt);
    updateDraft(draftId, { 
      name: orbName,
      blocks: currentBlocks 
    });
    toast.success('Draft saved successfully!');
  };

  const handleTestStrategy = () => {
    toast.info('Running strategy test...');
    // Simulate test
    setTimeout(() => {
      toast.success('Test completed! Strategy looks good.');
    }, 2000);
  };

  const handlePublish = () => {
    const draftId = createDraft(prompt);
    updateDraft(draftId, { 
      name: orbName,
      blocks: currentBlocks 
    });
    const newOrbId = publishOrb(draftId);
    console.log('Published orb ID:', newOrbId);
    toast.success('Orb published and activated!');
    if (newOrbId) {
      setTimeout(() => {
        console.log('Redirecting to:', `/orb/${newOrbId}`);
        window.location.href = `/orb/${newOrbId}`;
      }, 1500);
    }
  };

  const handleReset = () => {
    setCurrentBlocks('');
    toast.info('Workspace reset');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Builder Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <OrbIcon size="md" gradient={3} />
              <div>
                <Input
                  value={orbName}
                  onChange={(e) => setOrbName(e.target.value)}
                  className="text-xl font-bold border-0 p-0 h-auto bg-transparent focus:ring-0 focus:border-b focus:border-indigo-500"
                  placeholder="Orb Name"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">EPOCH:</span>
              <Select value={selectedEpoch} onValueChange={setSelectedEpoch}>
                <SelectTrigger className="w-24 h-8 border-0 bg-transparent focus:ring-0 text-sm font-medium">
                  <SelectValue placeholder="Epoch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 mins</SelectItem>
                  <SelectItem value="30">30 mins</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handlePublish} className="bg-indigo-600 hover:bg-indigo-700">
              <Rocket className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        {/* Original Prompt Display */}
        {prompt && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Original Strategy Prompt</CardTitle>
              <CardDescription>Build your visual strategy based on this description</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{prompt}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BlocklyEditor
            initialXml={currentBlocks}
            onWorkspaceChange={(xmlString) => {
              setCurrentBlocks(xmlString);
            }}
            onCodeGenerate={(code) => {
              console.log('Generated code:', code);
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}