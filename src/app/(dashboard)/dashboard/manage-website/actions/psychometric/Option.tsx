import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';

interface OptionProps {
    label: string;
    text: string;
    isCorrect: boolean;
    onSelectCorrect: () => void;
}

export function Option({ label, text, isCorrect, onSelectCorrect }: OptionProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-4 p-4 rounded-lg border-2 transition-all bg-white hover:bg-gray-50",
                isCorrect ? "border-green-500 bg-green-50" : "border-transparent shadow-sm"
            )}
        >
            <div className="flex-none w-10 h-10 rounded-full flex items-center justify-center border-2 border-muted-foreground/30 font-bold text-lg text-muted-foreground">
                {label}
            </div>
            <p className="flex-1 text-sm md:text-base font-medium text-foreground">{text}</p>

            {/* Selection for Admin to mark correct answer */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onSelectCorrect();
                }}
                className="cursor-pointer text-muted-foreground hover:text-green-600 transition-colors"
                title="Mark as correct answer"
            >
                {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                    <Circle className="w-6 h-6" />
                )}
            </div>
        </div>
    );
}
