"use client";

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { QuestionCard } from './QuestionCard';
import { Plus } from 'lucide-react';

// Use a local state copy of the data to allow adding questions for the UI demo
const INITIAL_DATA = [
    {
        id: 'verbal',
        label: 'Verbal Reasoning',
        questions: [{ id: 'q1', text: 'Address this situation?', options: [{ id: 'opt1', label: 'A', text: 'Complete their tasks yourself' }, { id: 'opt2', label: 'B', text: 'Schedule a private meeting' }, { id: 'opt3', label: 'C', text: 'Report to manager' }, { id: 'opt4', label: 'D', text: 'Ignore the issue' }] }]
    },
    {
        id: 'numerical',
        label: 'Numerical Reasoning',
        questions: [{ id: 'q2', text: 'What is the next number: 2, 6, 12, 20...?', options: [{ id: 'opt5', label: 'A', text: '30' }, { id: 'opt6', label: 'B', text: '42' }, { id: 'opt7', label: 'C', text: '28' }, { id: 'opt8', label: 'D', text: '32' }] }]
    },
    {
        id: 'abstract',
        label: 'Abstract Reasoning',
        questions: [{ id: 'q3', text: 'Which shape completes the pattern?', options: [{ id: 'opt9', label: 'A', text: 'Triangle' }, { id: 'opt10', label: 'B', text: 'Square' }, { id: 'opt11', label: 'C', text: 'Circle' }, { id: 'opt12', label: 'D', text: 'Star' }] }]
    },
    {
        id: 'sjt',
        label: 'Situational Judgement Test (SJT)',
        questions: [{ id: 'q4', text: 'You see a coworker stealing...', options: [{ id: 'opt13', label: 'A', text: 'Confront them' }, { id: 'opt14', label: 'B', text: 'Tell HR' }, { id: 'opt15', label: 'C', text: 'Ignore it' }, { id: 'opt16', label: 'D', text: 'Call police' }] }]
    },
];

export function PsychometricTabs() {
    const [data, setData] = useState(INITIAL_DATA);
    const [activeTab, setActiveTab] = useState('verbal');

    const addQuestion = () => {
        setData(prev => prev.map(tab => {
            if (tab.id === activeTab) {
                return {
                    ...tab,
                    questions: [...tab.questions, {
                        id: `new-${Date.now()}`,
                        text: 'New Question Text',
                        options: [
                            { id: `opt-${Date.now()}-1`, label: 'A', text: 'Option A' },
                            { id: `opt-${Date.now()}-2`, label: 'B', text: 'Option B' },
                            { id: `opt-${Date.now()}-3`, label: 'C', text: 'Option C' },
                            { id: `opt-${Date.now()}-4`, label: 'D', text: 'Option D' },
                        ]
                    }]
                };
            }
            return tab;
        }));
    };

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    {data.map(tab => (
                        <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
                    ))}
                </TabsList>
                {data.map(tab => (
                    <TabsContent key={tab.id} value={tab.id} className="space-y-6 pt-4">
                        {tab.questions.map((q, i) => (
                            <div key={q.id}>
                                <h3 className="font-semibold mb-2 text-lg">Practice Questions: {i + 1}</h3>
                                <QuestionCard question={q} />
                            </div>
                        ))}
                        <Button onClick={addQuestion} className="w-full" variant="secondary">
                            <Plus className="w-4 h-4 mr-2" /> Add Selection Question
                        </Button>
                    </TabsContent>
                ))}
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
            </div>
        </div>
    );
}
