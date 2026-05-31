import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ClippedContainer, TechHeader, CyberButton } from './UI';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[UNIVERSAL OS] Uncaught exception:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
          <ClippedContainer className="max-w-lg p-12 space-y-8 border-red-500/30 bg-red-500/5">
             <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/50 flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                   <ShieldAlert className="w-10 h-10" />
                </div>
                <TechHeader title="Kernel Panic" subtitle="System Interrupt Detected" color="red" />
                <div className="p-6 bg-black/40 border border-white/5 rounded-2xl font-mono text-[10px] text-white/40 text-left w-full overflow-auto max-h-32">
                   {this.state.error?.message || 'Unknown sector breach.'}
                </div>
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                   The neural link has been severed to prevent data corruption.
                </p>
                <CyberButton 
                  onClick={() => window.location.reload()}
                  className="w-full py-4 uppercase font-black tracking-widest"
                >
                   <RefreshCw className="w-4 h-4 mr-3" />
                   Reinitialize Link
                </CyberButton>
             </div>
          </ClippedContainer>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
