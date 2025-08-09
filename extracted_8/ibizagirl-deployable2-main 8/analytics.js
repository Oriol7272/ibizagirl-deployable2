// Analytics & Tracking System for IbizaGirl.pics
// Tracks user behavior, popular content, and conversion rates

class AnalyticsSystem {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.events = [];
        this.init();
    }

    init() {
        // Track page load
        this.trackEvent('page_load', {
            url: window.location.href,
            referrer: document.referrer,
            device: this.getDeviceInfo(),
            timestamp: new Date().toISOString()
        });

        // Track session duration
        window.addEventListener('beforeunload', () => {
            this.trackEvent('session_end', {
                duration: Date.now() - this.startTime,
                totalEvents: this.events.length
            });
            this.sendAnalytics();
        });

        // Track clicks
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-track]');
            if (target) {
                this.trackEvent('click', {
                    element: target.dataset.track,
                    text: target.textContent.slice(0, 50)
                });
            }
        });

        // Track scroll depth
        this.trackScrollDepth();

        // Track media views
        this.trackMediaViews();

        // Send analytics every 30 seconds
        setInterval(() => this.sendAnalytics(), 30000);
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getDeviceInfo() {
        const ua = navigator.userAgent;
        const mobile = /Mobile|Android|iPhone|iPad/i.test(ua);
        const tablet = /iPad|Android/i.test(ua) && !/Mobile/i.test(ua);
        
        return {
            type: tablet ? 'tablet' : mobile ? 'mobile' : 'desktop',
            screen: `${window.screen.width}x${window.screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            userAgent: ua.slice(0, 150)
        };
    }

    trackEvent(eventName, data = {}) {
        const event = {
            session: this.sessionId,
            event: eventName,
            data: data,
            timestamp: Date.now(),
            url: window.location.pathname
        };

        this.events.push(event);
        console.log('📊 Track:', eventName, data);

        // Track in Google Analytics if available
        if (window.gtag) {
            window.gtag('event', eventName, data);
        }

        // Track in Facebook Pixel if available
        if (window.fbq) {
            window.fbq('track', eventName, data);
        }
    }

    trackScrollDepth() {
        let maxScroll = 0;
        let scrollEvents = 0;

        window.addEventListener('scroll', () => {
            scrollEvents++;
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track milestones
                if (maxScroll >= 25 && maxScroll < 26) {
                    this.trackEvent('scroll_depth', { depth: '25%' });
                } else if (maxScroll >= 50 && maxScroll < 51) {
                    this.trackEvent('scroll_depth', { depth: '50%' });
                } else if (maxScroll >= 75 && maxScroll < 76) {
                    this.trackEvent('scroll_depth', { depth: '75%' });
                } else if (maxScroll >= 90) {
                    this.trackEvent('scroll_depth', { depth: '90%' });
                }
            }
        });
    }

    trackMediaViews() {
        // Track image views
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = entry.target;
                    if (!item.dataset.tracked) {
                        item.dataset.tracked = 'true';
                        this.trackEvent('media_view', {
                            id: item.dataset.id,
                            type: item.dataset.type,
                            title: item.querySelector('.thumb-title')?.textContent
                        });
                    }
                }
            });
        }, { threshold: 0.5 });

        // Observe all media items
        document.querySelectorAll('.thumb-item').forEach(item => {
            observer.observe(item);
        });
    }

    trackConversion(type, value) {
        this.trackEvent('conversion', {
            type: type,
            value: value,
            currency: 'EUR'
        });

        // Track revenue in Google Analytics
        if (window.gtag) {
            window.gtag('event', 'purchase', {
                value: value,
                currency: 'EUR',
                transaction_id: this.sessionId
            });
        }

        // Track in Facebook Pixel
        if (window.fbq) {
            window.fbq('track', 'Purchase', {
                value: value,
                currency: 'EUR'
            });
        }
    }

    getPopularContent() {
        // Analyze events to find most viewed content
        const contentViews = {};
        
        this.events.filter(e => e.event === 'media_view').forEach(event => {
            const id = event.data.id;
            contentViews[id] = (contentViews[id] || 0) + 1;
        });

        return Object.entries(contentViews)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([id, views]) => ({ id, views }));
    }

    getSessionStats() {
        const duration = Date.now() - this.startTime;
        const clicks = this.events.filter(e => e.event === 'click').length;
        const mediaViews = this.events.filter(e => e.event === 'media_view').length;
        
        return {
            sessionId: this.sessionId,
            duration: Math.floor(duration / 1000), // seconds
            totalEvents: this.events.length,
            clicks: clicks,
            mediaViews: mediaViews,
            device: this.getDeviceInfo().type
        };
    }

    async sendAnalytics() {
        if (this.events.length === 0) return;

        const payload = {
            session: this.sessionId,
            events: this.events.slice(-100), // Last 100 events
            stats: this.getSessionStats(),
            popular: this.getPopularContent()
        };

        try {
            // In production, send to your analytics endpoint
            const response = await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log('✅ Analytics sent successfully');
            }
        } catch (error) {
            // Store locally if sending fails
            localStorage.setItem('pending_analytics', JSON.stringify(payload));
            console.log('📊 Analytics stored locally');
        }
    }

    // Dashboard data for admin panel
    generateDashboard() {
        const stats = this.getSessionStats();
        const popular = this.getPopularContent();
        
        const dashboard = {
            realtime: {
                activeUsers: 1,
                currentSession: stats
            },
            popular: popular,
            conversions: {
                views: this.events.filter(e => e.event === 'media_view').length,
                unlockClicks: this.events.filter(e => e.data.element === 'unlock_button').length,
                conversionRate: 0
            },
            userFlow: this.getUserFlow()
        };

        return dashboard;
    }

    getUserFlow() {
        // Track user journey through the site
        const flow = [];
        let lastPage = null;

        this.events.forEach(event => {
            if (event.event === 'page_load' || event.event === 'media_view') {
                if (lastPage !== event.url) {
                    flow.push({
                        page: event.url || 'gallery',
                        time: event.timestamp
                    });
                    lastPage = event.url;
                }
            }
        });

        return flow;
    }
}

// Google Analytics Integration
function initGoogleAnalytics() {
    const GA_ID = 'G-XXXXXXXXXX'; // Replace with your GA4 ID
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_ID);
    
    window.gtag = gtag;
}

// Facebook Pixel Integration
function initFacebookPixel() {
    const PIXEL_ID = 'XXXXXXXXXX'; // Replace with your Pixel ID
    
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
    
    window.fbq = fbq;
}

// Heatmap Tracking
class HeatmapTracker {
    constructor() {
        this.clicks = [];
        this.movements = [];
        this.init();
    }

    init() {
        // Track clicks
        document.addEventListener('click', (e) => {
            this.clicks.push({
                x: e.pageX,
                y: e.pageY,
                time: Date.now(),
                element: e.target.tagName
            });
        });

        // Track mouse movements (throttled)
        let lastMove = 0;
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastMove > 100) { // Every 100ms
                lastMove = now;
                this.movements.push({
                    x: e.pageX,
                    y: e.pageY,
                    time: now
                });
                
                // Keep only last 100 movements
                if (this.movements.length > 100) {
                    this.movements.shift();
                }
            }
        });
    }

    generateHeatmap() {
        // Create visual heatmap data
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = document.documentElement.scrollHeight;
        const ctx = canvas.getContext('2d');

        // Draw clicks as heat points
        this.clicks.forEach(click => {
            const gradient = ctx.createRadialGradient(click.x, click.y, 0, click.x, click.y, 30);
            gradient.addColorStop(0, 'rgba(255,0,0,0.5)');
            gradient.addColorStop(1, 'rgba(255,0,0,0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(click.x - 30, click.y - 30, 60, 60);
        });

        return canvas.toDataURL();
    }
}

// Initialize Analytics
let analytics;
let heatmap;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize analytics
    analytics = new AnalyticsSystem();
    heatmap = new HeatmapTracker();
    
    // Initialize third-party analytics (only in production)
    if (window.location.hostname !== 'localhost') {
        initGoogleAnalytics();
        initFacebookPixel();
    }
    
    // Track unlock button specifically
    const unlockBtn = document.getElementById('unlockBtn');
    if (unlockBtn) {
        unlockBtn.dataset.track = 'unlock_button';
    }
    
    // Track media interactions
    document.addEventListener('click', (e) => {
        const mediaCard = e.target.closest('.thumb-item');
        if (mediaCard) {
            analytics.trackEvent('media_click', {
                id: mediaCard.dataset.id,
                type: mediaCard.dataset.type
            });
        }
    });
});

// Export for debugging
window.analytics = analytics;
