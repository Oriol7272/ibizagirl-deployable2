// PayPal Payment System for IbizaGirl.pics - LIVE PRODUCTION MODE
// Subscription: €10/month | Photo: €0.10 | Video: €0.30

// ============================
// Configuration - LIVE MODE
// ============================
const PAYPAL_CONFIG = {
    CLIENT_ID: 'AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5', // LIVE CLIENT ID
    SUBSCRIPTION_PLAN_ID: 'GCUY49PRUB6V2', // LIVE SUBSCRIPTION PLAN ID
    CURRENCY: 'EUR',
    PRICES: {
        MONTHLY_SUBSCRIPTION: 10.00,
        SINGLE_PHOTO: 0.10,
        SINGLE_VIDEO: 0.30
    },
    ENVIRONMENT: 'production' // LIVE MODE
};

// ============================
// Payment Manager
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
            script.onerror = () => {
                console.error('❌ Failed to load PayPal SDK');
            };
            document.head.appendChild(script);
        }
    }

    loadPaymentHistory() {
        // Load subscription from localStorage
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
            } else {
                console.log('⚠️ Subscription expired or inactive');
            }
        }

        // Load unlocked individual content
        const unlocked = localStorage.getItem('ibiza_purchased');
        if (unlocked) {
            this.unlockedContent = new Set(JSON.parse(unlocked));
            console.log(`📦 Loaded ${this.unlockedContent.size} purchased items`);
        }
    }

    savePaymentHistory() {
        localStorage.setItem('ibiza_purchased', JSON.stringify([...this.unlockedContent]));
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
                    🔓 VIP Paradise Access
                </h2>
                
                <div style="background: rgba(255,0,110,0.1); padding: 1.5rem; 
                            border-radius: 15px; margin-bottom: 1.5rem; 
                            border: 1px solid rgba(255,0,110,0.3);">
                    <div style="font-size: 3rem; font-weight: bold; color: #ffd700; margin-bottom: 0.5rem;">
                        €10/month
                    </div>
                    <div style="color: #888; font-size: 0.9rem;">Cancel anytime via PayPal</div>
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
                    🔒 Secure payment via PayPal • SSL Encrypted • Cancel anytime
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
                    label: 'subscribe',
                    height: 50
                },
                createSubscription: (data, actions) => {
                    console.log('🚀 Creating subscription with plan:', PAYPAL_CONFIG.SUBSCRIPTION_PLAN_ID);
                    return actions.subscription.create({
                        'plan_id': PAYPAL_CONFIG.SUBSCRIPTION_PLAN_ID,
                        'application_context': {
                            'brand_name': 'IbizaGirl.pics',
                            'user_action': 'SUBSCRIBE_NOW'
                        }
                    });
                },
                onApprove: (data, actions) => {
                    console.log('✅ Subscription approved:', data.subscriptionID);
                    this.handleSubscriptionSuccess(data);
                },
                onError: (err) => {
                    console.error('❌ PayPal Subscription Error:', err);
                    alert('❌ Payment failed. Please try again or contact support.');
                },
                onCancel: (data) => {
                    console.log('⚠️ Subscription cancelled by user');
                }
            }).render('#paypal-subscription-button');
        } else {
            document.getElementById('paypal-subscription-button').innerHTML = 
                '<p style="color: red;">PayPal not loaded. Please refresh the page.</p>';
        }
    }

    handleSubscriptionSuccess(data) {
        console.log('🎉 Processing subscription success');
        
        // Save subscription data
        this.isSubscribed = true;
        this.subscriptionData = {
            subscriptionId: data.subscriptionID,
            date: new Date().toISOString(),
            status: 'active',
            environment: 'production'
        };
        this.savePaymentHistory();

        // Update UI
        this.unlockAllContent();
        document.getElementById('subscription-modal')?.remove();
        
        // Show success notification
        this.showSuccessMessage('🎉 Welcome to VIP Paradise! All content unlocked!');
        
        // Track conversion
        if (window.gtag) {
            window.gtag('event', 'purchase', {
                transaction_id: data.subscriptionID,
                value: PAYPAL_CONFIG.PRICES.MONTHLY_SUBSCRIPTION,
                currency: PAYPAL_CONFIG.CURRENCY
            });
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
                                   margin-right: 0.5rem; transition: all 0.3s;">
                        Get Full Access
                    </button>
                    <button onclick="document.getElementById('ppv-modal').remove()" 
                            style="background: transparent; border: 1px solid #666; 
                                   color: #888; padding: 0.75rem 2rem; border-radius: 25px; 
                                   cursor: pointer; transition: all 0.3s;">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Render PayPal button for single payment - LIVE MODE
        if (window.paypal) {
            paypal.Buttons({
                style: {
                    shape: 'pill',
                    color: 'blue',
                    layout: 'horizontal',
                    label: 'pay',
                    height: 45
                },
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            description: `IbizaGirl.pics - ${contentType} - ${contentTitle}`,
                            amount: {
                                currency_code: PAYPAL_CONFIG.CURRENCY,
                                value: price.toFixed(2)
                            },
                            custom_id: contentId.toString()
                        }],
                        application_context: {
                            brand_name: 'IbizaGirl.pics'
                        }
                    });
                },
                onApprove: async (data, actions) => {
                    const order = await actions.order.capture();
                    console.log('✅ Single payment completed:', data.orderID);
                    this.handlePayPerViewSuccess(contentId, contentType, order);
                },
                onError: (err) => {
                    console.error('❌ PayPal Payment Error:', err);
                    alert('❌ Payment failed. Please try again or contact support.');
                }
            }).render('#paypal-ppv-button');
        } else {
            document.getElementById('paypal-ppv-button').innerHTML = 
                '<p style="color: red;">PayPal not loaded. Please refresh the page.</p>';
        }
    }

    handlePayPerViewSuccess(contentId, contentType, order) {
        console.log('✅ Processing single payment success');
        
        // Add to unlocked content
        this.unlockedContent.add(contentId.toString());
        this.savePaymentHistory();

        // Close modal
        document.getElementById('ppv-modal')?.remove();

        // Unlock the specific content
        this.unlockSingleContent(contentId);

        // Show success
        const emoji = contentType === 'video' ? '🎬' : '📸';
        this.showSuccessMessage(`${emoji} Content unlocked! Enjoy your premium content!`);

        // Track conversion
        if (window.gtag) {
            const price = contentType === 'video' ? 
                PAYPAL_CONFIG.PRICES.SINGLE_VIDEO : 
                PAYPAL_CONFIG.PRICES.SINGLE_PHOTO;
            window.gtag('event', 'purchase', {
                transaction_id: order.id,
                value: price,
                currency: PAYPAL_CONFIG.CURRENCY
            });
        }
    }

    // ============================
    // Content Unlocking
    // ============================
    checkContentAccess(contentId) {
        return this.isSubscribed || this.unlockedContent.has(contentId.toString());
    }

    unlockSingleContent(contentId) {
        // Find the content element
        const element = document.querySelector(`[data-id="${contentId}"]`);
        if (!element) return;

        // Remove blur and lock icon
        element.classList.add('unlocked');
        const media = element.querySelector('.thumb-media');
        if (media) {
            media.style.filter = 'none';
        }
        const lockIcon = element.querySelector('.lock-icon');
        if (lockIcon) {
            lockIcon.style.display = 'none';
        }

        console.log(`🔓 Unlocked content ID: ${contentId}`);
    }

    unlockAllContent() {
        console.log('🔓 Unlocking ALL content - VIP mode activated');
        
        // Remove all blur effects
        document.querySelectorAll('.thumb-media').forEach(media => {
            media.style.filter = 'none';
        });

        // Hide all lock icons
        document.querySelectorAll('.lock-icon').forEach(icon => {
            icon.style.display = 'none';
        });

        // Add unlocked class to all items
        document.querySelectorAll('.thumb-item').forEach(item => {
            item.classList.add('unlocked');
        });

        // Update unlock button
        const unlockBtn = document.getElementById('unlockBtn');
        if (unlockBtn) {
            unlockBtn.innerHTML = '✅ VIP Active';
            unlockBtn.style.background = 'linear-gradient(135deg, #00c851, #00ff88)';
            unlockBtn.onclick = () => this.showSubscriptionManagement();
        }
    }

    showSubscriptionManagement() {
        const modal = document.createElement('div');
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
        `;

        modal.innerHTML = `
            <div style="background: #1a1a1a; padding: 2rem; border-radius: 20px; 
                        border: 2px solid #00c851; color: white; text-align: center; max-width: 400px;">
                <h3 style="color: #00c851; margin-bottom: 1rem;">✅ VIP Subscription Active</h3>
                <p style="margin-bottom: 1.5rem; color: #ccc;">
                    You have unlimited access to all premium content.
                </p>
                <p style="margin-bottom: 1.5rem; color: #888; font-size: 0.9rem;">
                    To cancel your subscription, please visit your PayPal account settings.
                </p>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: #00c851; border: none; color: white; 
                               padding: 0.75rem 2rem; border-radius: 25px; cursor: pointer;">
                    Close
                </button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // ============================
    // Helper Functions
    // ============================
    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #00c851, #00ff88);
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-weight: 600;
            z-index: 10001;
            box-shadow: 0 10px 30px rgba(0,200,81,0.4);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    showPricingOptions() {
        const modal = document.createElement('div');
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
                        padding: 2rem; border-radius: 20px; max-width: 600px; width: 90%;
                        border: 2px solid #ff006e; color: white;">
                
                <h2 style="text-align: center; font-size: 2rem; margin-bottom: 2rem; 
                           background: linear-gradient(135deg, #ff006e, #ffd700); 
                           -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    Choose Your Paradise Access
                </h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <!-- Subscription Option -->
                    <div style="background: rgba(255,0,110,0.1); padding: 1.5rem; 
                                border-radius: 15px; border: 2px solid #ff006e; 
                                text-align: center; cursor: pointer; transition: all 0.3s;"
                         onclick="paypalManager.showSubscriptionModal(); this.parentElement.parentElement.parentElement.remove();">
                        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">👑</div>
                        <h3 style="color: #ff006e; margin-bottom: 0.5rem;">VIP Access</h3>
                        <div style="font-size: 1.8rem; font-weight: bold; color: #ffd700; margin-bottom: 0.5rem;">
                            €10/month
                        </div>
                        <div style="font-size: 0.9rem; color: #ccc;">
                            ✓ All content unlocked<br>
                            ✓ Best value<br>
                            ✓ Cancel anytime
                        </div>
                    </div>
                    
                    <!-- Pay Per View Option -->
                    <div style="background: rgba(255,215,0,0.1); padding: 1.5rem; 
                                border-radius: 15px; border: 2px solid #ffd700; 
                                text-align: center;">
                        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">💎</div>
                        <h3 style="color: #ffd700; margin-bottom: 0.5rem;">Pay Per View</h3>
                        <div style="font-size: 1.2rem; margin-bottom: 0.5rem; color: #ffd700;">
                            €0.10 / Photo<br>
                            €0.30 / Video
                        </div>
                        <div style="font-size: 0.9rem; color: #ccc;">
                            ✓ Pay only for what you want<br>
                            ✓ Permanent access<br>
                            ✓ No commitment
                        </div>
                    </div>
                </div>
                
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="width: 100%; background: transparent; border: 1px solid #666; 
                               color: #888; padding: 0.75rem; border-radius: 25px; 
                               cursor: pointer; transition: all 0.3s; margin-top: 1rem;">
                    Close
                </button>
            </div>
        `;

        document.body.appendChild(modal);
    }
}

// ============================
// Initialize Payment System - LIVE MODE
// ============================
let paypalManager;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing PayPal Payment System - LIVE MODE');
    
    // Initialize PayPal manager
    paypalManager = new PayPalPaymentManager();
    
    // Override unlock button
    const unlockBtn = document.getElementById('unlockBtn');
    if (unlockBtn) {
        if (paypalManager.isSubscribed) {
            unlockBtn.innerHTML = '✅ VIP Active';
            unlockBtn.style.background = 'linear-gradient(135deg, #00c851, #00ff88)';
            unlockBtn.onclick = () => paypalManager.showSubscriptionManagement();
        } else {
            unlockBtn.onclick = () => paypalManager.showPricingOptions();
        }
    }
    
    // Intercept content clicks for pay-per-view
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.thumb-item');
        if (item && !item.classList.contains('unlocked')) {
            const contentId = parseInt(item.dataset.id);
            const contentType = item.dataset.type;
            const contentTitle = item.querySelector('.thumb-title')?.textContent || 'Premium Content';
            
            // Check if user has access
            if (!paypalManager.checkContentAccess(contentId)) {
                e.preventDefault();
                e.stopPropagation();
                paypalManager.showPayPerViewModal(contentId, contentType, contentTitle);
            }
        }
    });
    
    // If subscribed, unlock all content immediately
    if (paypalManager.isSubscribed) {
        paypalManager.unlockAllContent();
    } else {
        // Check for individual purchases
        paypalManager.unlockedContent.forEach(contentId => {
            paypalManager.unlockSingleContent(contentId);
        });
    }
});

// Add CSS animations for better UX
const style = document.createElement('style');
style.textContent = `
    .thumb-item.unlocked .thumb-media {
        filter: none !important;
    }
    
    .thumb-item.unlocked .lock-icon {
        display: none !important;
    }
    
    .preview-media.unlocked {
        filter: none !important;
    }
    
    .paypal-button-container {
        min-height: 50px;
    }
`;
document.head.appendChild(style);

// Export for global access
window.paypalManager = paypalManager;

console.log('✅ PayPal Payment System loaded - LIVE PRODUCTION MODE');
