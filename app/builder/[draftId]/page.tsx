'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrbIcon } from '@/components/ui/orb-icon';
import { useOrbStore } from '@/lib/store';
import { Play, RotateCcw, Rocket, Save, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Dynamic import for client-side only rendering
const BlocklyEditor = dynamic(() => import('@/components/blockly-editor').then(mod => ({ default: mod.BlocklyEditor })), {
  ssr: false,
  loading: () => <div className="h-[600px] flex items-center justify-center border-2 border-gray-200 rounded-lg">Loading visual editor...</div>
});

export default function BuilderPage() {
  const router = useRouter();
  const params = useParams();
  const draftId = params.draftId as string;
  
  const { drafts, currentDraft, updateDraft, publishOrb, setCurrentDraft } = useOrbStore();
  const [orbName, setOrbName] = useState('');
  
  useEffect(() => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      setCurrentDraft(draft);
      setOrbName(draft.name);
    } else {
      // Redirect if draft not found
      router.push('/');
    }
  }, [draftId, drafts, setCurrentDraft, router]);

  const handleSaveDraft = () => {
    if (currentDraft) {
      updateDraft(currentDraft.id, { name: orbName });
      toast.success('Draft saved successfully!');
    }
  };

  const handleTestStrategy = () => {
    toast.info('Running strategy test...');
    // Simulate test
    setTimeout(() => {
      toast.success('Test completed! Strategy looks good.');
    }, 2000);
  };

  const handlePublish = () => {
    if (currentDraft) {
      publishOrb(currentDraft.id);
      toast.success('Orb published and activated!');
      router.push('/');
    }
  };

  const handleReset = () => {
    toast.info('Workspace reset');
  };

  const generateStrategyDescription = (prompt: string) => {
    // Simple natural language interpretation
    const conditions = [];
    const actions = [];
    
    if (prompt.toLowerCase().includes('buy')) {
      actions.push('Execute buy orders');
    }
    if (prompt.toLowerCase().includes('sell')) {
      actions.push('Execute sell orders');
    }
    if (prompt.toLowerCase().includes('rsi')) {
      conditions.push('Monitor RSI indicators');
    }
    if (prompt.toLowerCase().includes('gas')) {
      conditions.push('Track gas fee levels');
    }
    if (prompt.toLowerCase().includes('price')) {
      conditions.push('Watch price movements');
    }
    
    return {
      conditions: conditions.length > 0 ? conditions : ['Monitor market conditions'],
      actions: actions.length > 0 ? actions : ['Execute trading decisions']
    };
  };

  if (!currentDraft) {
    return <div>Loading...</div>;
  }

  const strategy = generateStrategyDescription(currentDraft.prompt);

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
                <p className="text-sm text-gray-600">Draft • Auto-saving</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={handleTestStrategy}>
              <Play className="w-4 h-4 mr-2" />
              Test
            </Button>
            <Button onClick={handlePublish} className="bg-indigo-600 hover:bg-indigo-700">
              <Rocket className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BlocklyEditor
            initialXml={currentDraft?.blocks}
            onWorkspaceChange={(xmlString) => {
              if (currentDraft) {
                updateDraft(currentDraft.id, { blocks: xmlString });
              }
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