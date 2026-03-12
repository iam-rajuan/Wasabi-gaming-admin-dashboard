import { Question } from '../../types';
import { Card, CardContent } from '@/components/ui/card';
import { Option } from './Option';
import { useState } from 'react';

interface QuestionCardProps {
    question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
    // In a real app, 'correctAnswer' would be part of the Question type.
    // For UI demo, we'll maintain local state or simulate it.
    const [correctId, setCorrectId] = useState<string | null>(null);

    return (
        <Card className="bg-muted/10">
            <CardContent className="pt-6 space-y-4">
                <div className="p-4 bg-secondary/20 rounded-lg">
                    <p className="font-medium text-lg">{question.text}</p>
                </div>
                <div className="space-y-3">
                    {question.options.map((opt) => (
                        <Option
                            key={opt.id}
                            label={opt.label}
                            text={opt.text}
                            isCorrect={correctId === opt.id}
                            onSelectCorrect={() => setCorrectId(opt.id)}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
