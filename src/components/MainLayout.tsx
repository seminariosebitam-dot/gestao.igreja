import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Logo } from './Logo';
import { NotificationCenter } from './NotificationCenter';
import { ThemeSwitcher } from './ThemeSwitcher';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const [open, setOpen] = useState(false);
    console.log('MainLayout: Rendering children', children ? 'exists' : 'null');

    return (
        <div className="flex min-h-screen bg-background" translate="no">
            {/* Desktop Sidebar - Shown ONLY on EXTRA large screens (PC > 1280px) */}
            <div className="hidden xl:flex print:hidden border-r border-border bg-card">
                <Sidebar />
            </div>

            {/* Mobile & Tablet Layout - Header always visible below 1280px */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="xl:hidden flex items-center justify-between py-3 px-4 sm:py-4 border-b border-border bg-card print:hidden shadow-sm relative z-50 safe-area-padding">
                    <div className="min-w-0 max-w-[50vw]"><Logo size="sm" /></div>
                    <div className="flex items-center gap-2 sm:gap-3 relative z-50">
                        <div className="relative z-50 min-h-[44px] min-w-[44px] flex items-center justify-center">
                            <ThemeSwitcher collapsed={true} direction="down" />
                        </div>
                        <NotificationCenter />
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-12 w-12 min-h-[48px] min-w-[48px] shadow-sm border border-border/50 bg-background/50 rounded-xl active:scale-95 transition-transform">
                                    <Menu className="h-6 w-6 sm:h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-[min(300px,85vw)] max-w-[85vw] border-r-0 rounded-r-2xl">
                                <div className="h-full" onClick={() => setOpen(false)}>
                                    <Sidebar />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-7xl animate-in fade-in duration-500 safe-area-padding">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
