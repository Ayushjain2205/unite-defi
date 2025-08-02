'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import 'blockly/javascript';
import { javascriptGenerator } from 'blockly/javascript';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Save } from 'lucide-react';

// Define custom blocks
const defineCustomBlocks = () => {
  // Trading condition block
  Blockly.Blocks['trading_condition'] = {
    init: function() {
      this.appendDummyInput()
        .appendField("When")
        .appendField(new Blockly.FieldDropdown([
          ["RSI", "RSI"],
          ["Price", "PRICE"],
          ["Volume", "VOLUME"],
          ["Gas Fee", "GAS"]
        ]), "INDICATOR")
        .appendField(new Blockly.FieldDropdown([
          ["<", "LT"],
          [">", "GT"],
          ["=", "EQ"]
        ]), "OPERATOR");
      this.appendValueInput("VALUE")
        .setCheck("Number");
      this.setInputsInline(true);
      this.setOutput(true, "Boolean");
      this.setColour(210);
      this.setTooltip("Trading condition trigger");
    }
  };

  // Trading action block
  Blockly.Blocks['trading_action'] = {
    init: function() {
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ["Buy", "BUY"],
          ["Sell", "SELL"]
        ]), "ACTION");
      this.appendValueInput("AMOUNT")
        .setCheck("Number");
      this.appendDummyInput()
        .appendField("of")
        .appendField(new Blockly.FieldDropdown([
          ["ETH", "ETH"],
          ["BTC", "BTC"],
          ["SOL", "SOL"]
        ]), "ASSET");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("Execute trading action");
    }
  };

  // Strategy start block
  Blockly.Blocks['strategy_start'] = {
    init: function() {
      this.appendDummyInput()
        .appendField("Trading Strategy");
      this.appendStatementInput("DO")
        .setCheck(null)
        .appendField("Execute:");
      this.setColour(160);
      this.setTooltip("Entry point for trading strategy");
      this.setDeletable(false);
    }
  };
};

// Define code generators
const defineCodeGenerators = () => {
  javascriptGenerator.forBlock['trading_condition'] = function(block, generator) {
    const indicator = block.getFieldValue('INDICATOR');
    const operator = block.getFieldValue('OPERATOR');
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
    
    const operatorMap = {
      'LT': '<',
      'GT': '>',
      'EQ': '=='
    };
    
    const code = `check${indicator}() ${operatorMap[operator]} ${value}`;
    return [code, javascriptGenerator.ORDER_RELATIONAL];
  };

  javascriptGenerator.forBlock['trading_action'] = function(block, generator) {
    const action = block.getFieldValue('ACTION');
    const amount = generator.valueToCode(block, 'AMOUNT', generator.ORDER_ATOMIC) || '0';
    const asset = block.getFieldValue('ASSET');
    
    const code = `execute${action}(${amount}, '${asset}');\n`;
    return code;
  };

  javascriptGenerator.forBlock['strategy_start'] = function(block, generator) {
    const statements = generator.statementToCode(block, 'DO');
    const code = `function runTradingStrategy() {\n${statements}}\n\nrunTradingStrategy();`;
    return code;
  };
};

// Simple toolbox configuration
const toolbox = {
  "kind": "categoryToolbox",
  "contents": [
    {
      "kind": "category",
      "name": "🎯 Strategy",
      "colour": "#5C81A6",
      "contents": [
        {
          "kind": "block",
          "type": "strategy_start"
        },
        {
          "kind": "block",
          "type": "controls_if"
        }
      ]
    },
    {
      "kind": "category",
      "name": "📊 Conditions",
      "colour": "#5CA65C",
      "contents": [
        {
          "kind": "block",
          "type": "trading_condition",
          "inputs": {
            "VALUE": {
              "block": {
                "type": "math_number",
                "fields": {
                  "NUM": 30
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "logic_compare"
        },
        {
          "kind": "block",
          "type": "logic_operation"
        }
      ]
    },
    {
      "kind": "category",
      "name": "⚡ Actions",
      "colour": "#A65C81",
      "contents": [
        {
          "kind": "block",
          "type": "trading_action",
          "inputs": {
            "AMOUNT": {
              "block": {
                "type": "math_number",
                "fields": {
                  "NUM": 1
                }
              }
            }
          }
        }
      ]
    },
    {
      "kind": "category",
      "name": "🔢 Math",
      "colour": "#745CA6",
      "contents": [
        {
          "kind": "block",
          "type": "math_number"
        },
        {
          "kind": "block",
          "type": "math_arithmetic"
        }
      ]
    },
    {
      "kind": "category",
      "name": "🔗 Logic",
      "colour": "#A6745C",
      "contents": [
        {
          "kind": "block",
          "type": "logic_boolean"
        },
        {
          "kind": "block",
          "type": "logic_negate"
        }
      ]
    }
  ]
};

interface BlocklyEditorProps {
  initialXml?: string;
  onWorkspaceChange?: (xmlString: string) => void;
  onCodeGenerate?: (code: string) => void;
}

export function BlocklyEditor({ initialXml, onWorkspaceChange, onCodeGenerate }: BlocklyEditorProps) {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isInitializing = useRef(true);

  const handleWorkspaceChange = useCallback(() => {
    if (!workspace || isInitializing.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        const xml = Blockly.Xml.workspaceToDom(workspace);
        const xmlString = Blockly.Xml.domToText(xml);
        onWorkspaceChange?.(xmlString);

        const code = javascriptGenerator.workspaceToCode(workspace);
        setGeneratedCode(code);
        onCodeGenerate?.(code);
      } catch (error) {
        console.error('Error in workspace change handler:', error);
      }
    }, 300);
  }, [workspace, onWorkspaceChange, onCodeGenerate]);

  useEffect(() => {
    if (!blocklyDiv.current) return;

    try {
      // Define custom blocks and generators
      defineCustomBlocks();
      defineCodeGenerators();

      // Create workspace
      const ws = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox,
        trashcan: true,
        scrollbars: true,
        media: 'https://unpkg.com/blockly/media/',
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        }
      });

      setWorkspace(ws);

      // Load initial XML if provided
      if (initialXml) {
        try {
          const xml = Blockly.utils.xml.textToDom(initialXml);
          Blockly.Xml.domToWorkspace(xml, ws);
        } catch (error) {
          console.error('Error loading initial XML:', error);
        }
      } else {
        // Add a default strategy start block
        const startBlock = ws.newBlock('strategy_start');
        startBlock.initSvg();
        startBlock.render();
        startBlock.moveBy(50, 50);
      }

      // Add workspace change listener
      ws.addChangeListener(handleWorkspaceChange);

      // Mark initialization as complete
      setTimeout(() => {
        isInitializing.current = false;
      }, 100);

      // Cleanup
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        ws.removeChangeListener(handleWorkspaceChange);
        ws.dispose();
      };
    } catch (error) {
      console.error('Error initializing Blockly workspace:', error);
    }
  }, [handleWorkspaceChange, initialXml]);

  const handleReset = () => {
    if (workspace) {
      workspace.clear();
      const startBlock = workspace.newBlock('strategy_start');
      startBlock.initSvg();
      startBlock.render();
      startBlock.moveBy(50, 50);
    }
  };

  const handleTest = () => {
    if (generatedCode) {
      console.log('Generated Strategy Code:', generatedCode);
      alert('Check the console for generated code!');
    } else {
      alert('No code generated yet. Add some blocks to your strategy!');
    }
  };

  const handleSave = () => {
    if (workspace) {
      const xml = Blockly.Xml.workspaceToDom(workspace);
      const xmlText = Blockly.Xml.domToText(xml);
      console.log('Saved workspace:', xmlText);
      alert('Strategy saved! Check console for XML data.');
    }
  };

  return (
    <Card className="h-[600px] border-2 border-gray-200">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Visual Strategy Builder</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleTest}>
              <Play className="w-4 h-4 mr-2" />
              Test
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <div ref={blocklyDiv} className="h-full w-full" />
        </div>
        
        {generatedCode && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <details>
              <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                Generated Strategy Code
              </summary>
              <pre className="mt-2 text-xs text-gray-600 bg-white p-2 rounded border overflow-x-auto">
                {generatedCode}
              </pre>
            </details>
          </div>
        )}
      </div>
    </Card>
  );
}