// Development-only startup performance instrumentation
const isDev = import.meta.env.DEV;

interface PerfMark {
  name: string;
  timestamp: number;
}

class StartupPerf {
  private marks: PerfMark[] = [];
  private startTime: number = 0;

  constructor() {
    if (isDev) {
      this.startTime = performance.now();
      this.mark('app-bootstrap');
    }
  }

  mark(name: string) {
    if (!isDev) return;
    
    const timestamp = performance.now();
    this.marks.push({ name, timestamp });
    
    if (typeof performance.mark === 'function') {
      performance.mark(`caffeine:${name}`);
    }
  }

  measure(name: string, startMark: string, endMark: string) {
    if (!isDev) return;
    
    try {
      if (typeof performance.measure === 'function') {
        performance.measure(
          `caffeine:${name}`,
          `caffeine:${startMark}`,
          `caffeine:${endMark}`
        );
      }
    } catch (e) {
      // Ignore measurement errors
    }
  }

  logReport() {
    if (!isDev || this.marks.length === 0) return;

    console.group('⚡ Startup Performance');
    
    this.marks.forEach((mark, index) => {
      const elapsed = mark.timestamp - this.startTime;
      const delta = index > 0 ? mark.timestamp - this.marks[index - 1].timestamp : 0;
      
      console.log(
        `${mark.name.padEnd(30)} ${elapsed.toFixed(0)}ms total ${
          delta > 0 ? `(+${delta.toFixed(0)}ms)` : ''
        }`
      );
    });
    
    console.groupEnd();
  }
}

export const startupPerf = new StartupPerf();
