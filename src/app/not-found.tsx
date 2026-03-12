import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-center">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">Page Not Found</h2>
            <p className="mt-2 text-gray-500">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
            <div className="mt-6">
                <Link href="/dashboard">
                    <Button>Return to Dashboard</Button>
                </Link>
            </div>
        </div>
    );
}
