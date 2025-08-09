// PayPal Payment System for IbizaGirl.pics - LIVE PRODUCTION MODE
// Subscription: €10/month | Photo: €0.10 | Video: €0.30

// ============================
// Configuration - LIVE PRODUCTION
// ============================
const PAYPAL_CONFIG = {
    CLIENT_ID: 'AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5', // LIVE CLIENT ID
    CURRENCY: 'EUR',
    PRICES: {
        MONTHLY_SUBSCRIPTION: 10.00,
        SINGLE_PHOTO: 0.10,
        SINGLE_VIDEO: 0.30
    },
    SUBSCRIPTION_PLAN_ID: 'GCUY49PRUB6V2' // LIVE SUBSCRIPTION PLAN ID
};

// ============================
// Payment Manager - LIVE MODE
// ============================
class PayPalPaymentManager {
    constructor() {
        this.isSubscribed = false;
        this.unlockedContent = new Set();
        this.loadPaymentHistory();
        this.initPayPal();
        console.log('🔥 PayPal Manager initialized - LIVE PRODUCTION MODE');
    }

    initPayPal() {
        // Load PayPal SDK for LIVE production
        if (!document.querySelector('#paypal-sdk')) {
            const script = document.createElement('script');
            script.id = 'paypal-sdk';
            script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CONFIG.CLIENT_ID}&vault=true&intent=subscription&currency=${PAYPAL_CONFIG.CURRENCY}`;
            script.onload = () => {
                console.log('✅ PayPal SDK loaded - LIVE PRODUCTION MODE');
                this.paypalReady = true;
            };
            document.head.appendChild(script);
        }
    }

    loadPaymentHistory() {
        // Load from localStorage (in production, verify with backend)
        const subscription = localStorage.getItem('ibiza_subscription');
        if (subscription) {
            const subData = JSON.parse(subscription);
            // Check if subscription is still valid (within 30 days)
            const subDate = new Date(subData.date);
            const now = new Date();
            const daysSince = (now - subDate) / (1000 * 60 * 60 * 24);
            
            if (daysSince <= 30 && subData.status === 'active') {
                this.isSubscribed = true;
                this.subscriptionData = subData;
                console.log('✅ Active subscription found');
            }
        }

        // Load unlocked content
        const unlocked = localStorage.getItem('ibiza_unlocked_content');
        if (unlocked) {
            this.unlockedContent = new Set(JSON.parse(unlocked));
        }
    }

    savePaymentHistory() {
        localStorage.setItem('ibiza_unlocked_content', JSON.stringify([...this.unlockedContent]));
        if (this.subscriptionData) {
            localStorage.setItem('ibiza_subscription', JSON.stringify(this.subscriptionData));
        }
    }

    // ============================
    // Monthly Subscription - LIVE MODE
    // ============================
    showSubscriptionModal() {
        const modal = document.createElement('div');
        modal.id = 'subscription-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
        `;

        modal.innerHTML = `
            <div style="background: linear-gradient(135deg, #1a1a1a, #2a2a2a); 
                        padding: 2rem; border-radius: 20px; max-width: 500px; width: 90%;
                        border: 2px solid #ff006e; color: white; text-align: center;">
                
                <h2 style="font-size: 2rem; margin-bottom: 1rem; 
                           background: linear-gradient(135deg, #ff006e, #ffd700); 
                           -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    🔓 Unlimited Access
                </h2>
                
                <div style="background: rgba(255,0,110,0.1); padding: 1.5rem; 
                            border-radius: 15px; margin-bottom: 1.5rem; 
                            border: 1px solid rgba(255,0,110,0.3);">
                    <div style="font-size: 3rem; font-weight: bold; color: #ffd700; margin-bottom: 0.5rem;">
                        €10/month
                    </div>
                    <div style="color: #888; font-size: 0.9rem;">Cancel anytime</div>
                </div>
                
                <div style="text-align: left; margin-bottom: 2rem; padding: 0 1rem;">
                    <div style="margin-bottom: 0.75rem;">✅ Instant access to ALL photos & videos</div>
                    <div style="margin-bottom: 0.75rem;">✅ No blur, full HD quality</div>
                    <div style="margin-bottom: 0.75rem;">✅ New content added weekly</div>
                    <div style="margin-bottom: 0.75rem;">✅ Download enabled</div>
                    <div style="margin-bottom: 0.75rem;">✅ Priority access to new content</div>
                </div>
                
                <div id="paypal-subscription-button"></div>
                
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #333;">
                    <button onclick="document.getElementById('subscription-modal').remove()" 
                            style="background: transparent; border: 1px solid #666; 
                                   color: #888; padding: 0.75rem 2rem; border-radius: 25px; 
                                   cursor: pointer; transition: all 0.3s;">
                        Maybe Later
                    </button>
                </div>
                
                <p style="margin-top: 1rem; font-size: 0.8rem; color: #666;">
                    🔒 Secure payment via PayPal • Cancel anytime in PayPal settings
                </p>
            </div>
        `;

        document.body.appendChild(modal);

        // Render PayPal subscription button - LIVE MODE
        if (window.paypal) {
            paypal.Buttons({
                style: {
                    shape: 'pill',
                    color: 'gold',
                    layout: 'horizontal',
                    label: 'subscribe'
                },
                createSubscription: (data, actions) => {
                    return actions.subscription.create({
                        'plan_id': PAYPAL_CONFIG.SUBSCRIPTION_PLAN_ID,
                        'custom_id': this.generateUserId()
                    });
                },
                onApprove: (data, actions) => {
                    this.handleSubscriptionSuccess(data);
                },
                onError: (err) => {
                    console.error('PayPal Error:', err);
                    alert('❌ Payment failed. Please try again.');
                }
            }).render('#paypal-subscription-button');
        }
    }

    handleSubscriptionSuccess(data) {
        // Save subscription
        this.isSubscribed = true;
        this.subscriptionData = {
            subscriptionId: data.subscriptionID,
            date: new Date().toISOString(),
            userId: this.generateUserId()
        };
        this.savePaymentHistory();

        // Update UI
        this.unlockAllContent();
        document.getElementById('subscription-modal')?.remove();
        
        // Show success
        this.showSuccessMessage('🎉 Welcome to VIP! All content is now unlocked!');
        
        // Track conversion
        if (window.analytics) {
            window.analytics.trackConversion('subscription', PAYPAL_CONFIG.PRICES.MONTHLY_SUBSCRIPTION);
        }
    }

    // ============================
    // Pay-Per-View (Single Content) - LIVE MODE
    // ============================
    showPayPerViewModal(contentId, contentType, contentTitle) {
        const price = contentType === 'video' ? 
            PAYPAL_CONFIG.PRICES.SINGLE_VIDEO : 
            PAYPAL_CONFIG.PRICES.SINGLE_PHOTO;
        
        const emoji = contentType === 'video' ? '🎬' : '📸';

        const modal = document.createElement('div');
        modal.id = 'ppv-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
        `;

        modal.innerHTML = `
            <div style="background: linear-gradient(135deg, #1a1a1a, #2a2a2a); 
                        padding: 2rem; border-radius: 20px; max-width: 450px; width: 90%;
                        border: 2px solid #ff006e; color: white; text-align: center;">
                
                <div style="font-size: 3rem; margin-bottom: 1rem;">${emoji}</div>
                
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #ff006e;">
                    Unlock This ${contentType === 'video' ? 'Video' : 'Photo'}
                </h3>
                
                <p style="color: #ccc; margin-bottom: 1.5rem; font-size: 1.1rem;">
                    "${contentTitle}"
                </p>
                
                <div style="background: rgba(255,215,0,0.1); padding: 1rem; 
                            border-radius: 10px; margin-bottom: 1.5rem; 
                            border: 1px solid rgba(255,215,0,0.3);">
                    <div style="font-size: 2.5rem; font-weight: bold; color: #ffd700;">
                        €${price.toFixed(2)}
                    </div>
                    <div style="color: #888; font-size: 0.9rem; margin-top: 0.5rem;">
                        One-time payment • Permanent access
                    </div>
                </div>
                
                <div id="paypal-ppv-button"></div>
                
                <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #333;">
                    <div style="color: #888; font-size: 0.9rem; margin-bottom: 1rem;">
                        💡 Tip: Get unlimited access for just €10/month
                    </div>
                    <button onclick="paypalManager.showSubscriptionModal(); document.getElementById('ppv-modal').remove();" 
                            style="background: linear-gradient(135deg, #ff006e, #ffd700); 
                                   border: none; color: white; padding: 0.75rem 2rem; 
                                   border-radius: 25px; cursor: pointer; font-weight: 600; 
                                   margin-right:
