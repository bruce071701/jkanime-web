import { useState, useEffect } from 'react';
import { BarChart3, Eye, Search, Play, Filter, AlertCircle } from 'lucide-react';
import { ANALYTICS_CONFIG } from '../config/analytics';

interface AnalyticsEvent {
  timestamp: number;
  event: string;
  parameters: Record<string, any>;
}

export function AnalyticsDashboard() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 只在开发环境显示
    if (!ANALYTICS_CONFIG.DEBUG) return;

    // 拦截gtag调用来记录事件
    const originalGtag = window.gtag;
    
    window.gtag = (...args: any[]) => {
      const [command, eventName, parameters] = args;
      
      if (command === 'event') {
        const newEvent: AnalyticsEvent = {
          timestamp: Date.now(),
          event: eventName,
          parameters: parameters || {}
        };
        
        setEvents(prev => [newEvent, ...prev.slice(0, 49)]); // 保留最近50个事件
      }
      
      // 调用原始gtag
      if (originalGtag) {
        originalGtag(...args);
      }
    };

    return () => {
      window.gtag = originalGtag;
    };
  }, []);

  if (!ANALYTICS_CONFIG.DEBUG) return null;

  const getEventIcon = (eventName: string) => {
    if (eventName.includes('search')) return <Search className="h-4 w-4" />;
    if (eventName.includes('view') || eventName.includes('anime')) return <Eye className="h-4 w-4" />;
    if (eventName.includes('play') || eventName.includes('video')) return <Play className="h-4 w-4" />;
    if (eventName.includes('filter')) return <Filter className="h-4 w-4" />;
    if (eventName.includes('error') || eventName.includes('exception')) return <AlertCircle className="h-4 w-4" />;
    return <BarChart3 className="h-4 w-4" />;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors mb-2"
        title="Analytics Dashboard"
      >
        <BarChart3 className="h-5 w-5" />
        {events.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {events.length > 9 ? '9+' : events.length}
          </span>
        )}
      </button>

      {/* Dashboard Panel */}
      {isVisible && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-96 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics Events
            </h3>
            <p className="text-gray-400 text-sm">
              {events.length} events tracked
            </p>
          </div>

          <div className="overflow-y-auto max-h-80">
            {events.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No events tracked yet
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {events.map((event, index) => (
                  <div key={index} className="p-3 hover:bg-gray-750">
                    <div className="flex items-start gap-3">
                      <div className="text-blue-400 mt-0.5">
                        {getEventIcon(event.event)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white text-sm font-medium truncate">
                            {event.event}
                          </h4>
                          <span className="text-gray-400 text-xs">
                            {formatTimestamp(event.timestamp)}
                          </span>
                        </div>
                        {Object.keys(event.parameters).length > 0 && (
                          <div className="mt-1">
                            {Object.entries(event.parameters).slice(0, 3).map(([key, value]) => (
                              <div key={key} className="text-xs text-gray-400">
                                <span className="text-gray-300">{key}:</span> {String(value)}
                              </div>
                            ))}
                            {Object.keys(event.parameters).length > 3 && (
                              <div className="text-xs text-gray-500">
                                +{Object.keys(event.parameters).length - 3} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {events.length > 0 && (
            <div className="p-3 border-t border-gray-700">
              <button
                onClick={() => setEvents([])}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Clear Events
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}