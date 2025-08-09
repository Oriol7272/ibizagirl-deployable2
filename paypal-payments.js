// ============================
// PAYPAL PAYMENTS INTEGRATION
// Enhanced Ocean Paradise Payment System
// ============================

console.log('💳 Loading PayPal Ocean Paradise Integration...');

// ============================
// PAYPAL CONFIGURATION
// ============================

const PAYPAL_CONFIG = {
    CLIENT_ID: 'AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5',
    CURRENCY: 'EUR',
    ENVIRONMENT: 'production', // Change to 'sandbox' for testing
    PRICES: {
        VIP_MONTHLY: 10.00,
        SINGLE_PHOTO: 0.10,
        SINGLE_VIDEO: 0.30,
        PHOTO_BUNDLE_10: 0.80,
        VIDEO_BUNDLE_5: 1.20
    }
};

// ============================
// PAYMENT TRACKING & ANALYTICS
// ============================

class PaymentTracker {
    static trackPaymentAttempt(type, amount) {
        console.log(`💳 Payment attempt: ${type} - €${amount}`);
        
        if (window.gtag) {
            window.gtag('event', 'payment_attempt', {
                event_category: 'ecommerce',
                event_label: type,
                value: amount,
                currency: 'EUR'
            });
        }
    }
    
    static trackPaymentSuccess(type, amount, transactionId) {
        console.log(`✅ Payment success: ${type} - €${amount} - ${transactionId}`);
        
        if (window.gtag) {
            window.gtag('event', 'purchase', {
                transaction_id: transactionId,
                value: amount,
                currency: 'EUR',
                items: [{
                    item_id: type,
                    item_name: `IbizaGirl.pics ${type}`,
                    category: 'digital_content',
                    quantity: 1,
                    price: amount
                }]
            });
        }
        
        // Store purchase locally
        this.storePurchase(type, amount, transactionId);
    }
    
    static trackPaymentError(error, type, amount) {
        console.error(`❌ Payment error: ${type} - €${amount}`, error);
        
        if (window.gtag) {
            window.gtag('event', 'payment_error', {
                event_category: 'error',
                event_label: type,
                description: error.message || 'Unknown error'
            });
        }
    }
    
    static storePurchase(type, amount, transactionId) {
        const purchases = JSON.parse(localStorage.getItem('ibiza_purchases') || '[]');
        purchases.push({
            type,
            amount,
            transactionId,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('ibiza_purchases', JSON.stringify(purchases));
    }
}

// ============================
// ENHANCED PAYPAL BUTTON RENDERER
// ============================

class PayPalRenderer {
    static renderSubscriptionButton(containerId, onSuccess, onError) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ PayPal container not found: ${containerId}`);
            return;
        }
        
        container.innerHTML = '<div style="text-align: center; padding: 1rem; color: #7fdbff;">🌊 Loading PayPal...</div>';
        
        if (typeof paypal === 'undefined') {
            container.innerHTML = `
                <div style="color: #ff6b6b; text-align: center; padding: 1rem;">
                    ❌ PayPal SDK not loaded<br>
                    <button onclick="location.reload()" style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: var(--ocean-bright); border: none; border-radius: 20px; color: white; cursor: pointer;">
                        Reload Page
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        PaymentTracker.trackPaymentAttempt('vip_subscription', PAYPAL_CONFIG.PRICES.VIP_MONTHLY);
        
        paypal.Buttons({
            style: {
                shape: 'pill',
                color: 'gold',
                layout: 'horizontal',
                label: 'subscribe',
                height: 50
            },
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        description: '🌊 IbizaGirl.pics - Monthly VIP Ocean Access',
                        amount: {
                            currency_code: PAYPAL_CONFIG.CURRENCY,
                            value: PAYPAL_CONFIG.PRICES.VIP_MONTHLY.toFixed(2)
                        },
                        custom_id: `vip_subscription_${Date.now()}`,
                        soft_descriptor: 'IBIZAGIRL VIP'
                    }],
                    application_context: {
                        brand_name: 'IbizaGirl.pics Ocean Paradise',
                        user_action: 'PAY_NOW',
                        shipping_preference: 'NO_SHIPPING'
                    }
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then((details) => {
                    const transactionId = details.id;
                    PaymentTracker.trackPaymentSuccess('vip_subscription', PAYPAL_CONFIG.PRICES.VIP_MONTHLY, transactionId);
                    
                    if (onSuccess) {
                        onSuccess(data, details);
                    } else {
                        this.handleDefaultSubscriptionSuccess(data, details);
                    }
                });
            },
            onError: (err) => {
                PaymentTracker.trackPaymentError(err, 'vip_subscription', PAYPAL_CONFIG.PRICES.VIP_MONTHLY);
                if (onError) {
                    onError(err);
                } else {
                    this.handleDefaultError(err);
                }
            },
            onCancel: (data) => {
                console.log('💔 VIP subscription cancelled by user');
                if (window.gtag) {
                    window.gtag('event', 'payment_cancelled', {
                        event_category: 'ecommerce',
                        event_label: 'vip_subscription'
                    });
                }
            }
        }).render(`#${containerId}`);
    }
    
    static renderSinglePaymentButton(containerId, contentId, contentType, price, onSuccess, onError) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ PayPal container not found: ${containerId}`);
            return;
        }
        
        container.innerHTML = '<div style="text-align: center; padding: 1rem; color: #7fdbff;">🌊 Loading PayPal...</div>';
        
        if (typeof paypal === 'undefined') {
            container.innerHTML = `
                <div style="color: #ff6b6b; text-align: center; padding: 1rem;">
                    ❌ PayPal SDK not loaded<br>
                    <button onclick="location.reload()" style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: var(--ocean-bright); border: none; border-radius: 20px; color: white; cursor: pointer;">
                        Reload Page
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        PaymentTracker.trackPaymentAttempt(`single_${contentType}`, price);
        
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
                        description: `🌊 IbizaGirl.pics - ${contentType.toUpperCase()} ${contentId}`,
                        amount: {
                            currency_code: PAYPAL_CONFIG.CURRENCY,
                            value: price.toFixed(2)
                        },
                        custom_id: `${contentType}_${contentId}_${Date.now()}`,
                        soft_descriptor: 'IBIZAGIRL CONTENT'
                    }],
                    application_context: {
                        brand_name: 'IbizaGirl.pics Ocean Paradise',
                        user_action: 'PAY_NOW',
                        shipping_preference: 'NO_SHIPPING'
                    }
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then((details) => {
                    const transactionId = details.id;
                    PaymentTracker.trackPaymentSuccess(`single_${contentType}`, price, transactionId);
                    
                    if (onSuccess) {
                        onSuccess(contentId, contentType, data, details);
                    } else {
                        this.handleDefaultSinglePaymentSuccess(contentId, contentType, data, details);
                    }
                });
            },
            onError: (err) => {
                PaymentTracker.trackPaymentError(err, `single_${contentType}`, price);
                if (onError) {
                    onError(err);
                } else {
                    this.handleDefaultError(err);
                }
            },
            onCancel: (data) => {
                console.log(`💔 ${contentType} payment cancelled by user`);
                if (window.gtag) {
                    window.gtag('event', 'payment_cancelled', {
                        event_category: 'ecommerce',
                        event_label: `single_${contentType}`
                    });
                }
            }
        }).render(`#${containerId}`);
    }
    
    // ============================
    // DEFAULT SUCCESS HANDLERS
    // ============================
    
    static handleDefaultSubscriptionSuccess(data, details) {
        console.log('🎉 VIP Ocean Access activated!', details);
        
        // Store VIP status
        localStorage.setItem('ibiza_vip', JSON.stringify({
            active: true,
            date: new Date().toISOString(),
            transactionId: details.id,
            subscriptionId: data.subscriptionID || data.orderID
        }));
        
        // Update UI
        if (window.unlockAllContent) {
            window.unlockAllContent();
        }
        
        if (window.closeModal) {
            window.closeModal();
        }
        
        this.showPaymentSuccessNotification('🌊 VIP Ocean Access Activated!', 'All content is now unlocked. Enjoy your ocean paradise!');
    }
    
    static handleDefaultSinglePaymentSuccess(contentId, contentType, data, details) {
        console.log(`✅ Content unlocked: ${contentId}`, details);
        
        // Store unlocked content
        const unlockedContent = JSON.parse(localStorage.getItem('ibiza_unlocked') || '[]');
        if (!unlockedContent.includes(contentId)) {
            unlockedContent.push(contentId);
            localStorage.setItem('ibiza_unlocked', JSON.stringify(unlockedContent));
        }
        
        // Update UI
        if (window.unlockSingleContent) {
            window.unlockSingleContent(contentId);
        }
        
        if (window.closeModal) {
            window.closeModal();
        }
        
        const emoji = contentType === 'video' ? '🎬' : '📸';
        this.showPaymentSuccessNotification(`${emoji} Content Unlocked!`, 'Enjoy your ocean paradise content!');
    }
    
    static handleDefaultError(err) {
        console.error('❌ PayPal Error:', err);
        
        let errorMessage = 'Payment failed. Please try again.';
        
        if (err.message && err.message.includes('INSTRUMENT_DECLINED')) {
            errorMessage = 'Card declined. Please try a different payment method.';
        } else if (err.message && err.message.includes('PAYER_ACTION_REQUIRED')) {
            errorMessage = 'Please complete the payment process.';
        }
        
        this.showPaymentErrorNotification(errorMessage);
    }
    
    // ============================
    // NOTIFICATION SYSTEM
    // ============================
    
    static showPaymentSuccessNotification(title, message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #00c851, #00ff88);
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 20px;
            font-weight: 700;
            z-index: 10001;
            box-shadow: 0 15px 40px rgba(0, 200, 81, 0.4);
            text-align: center;
            max-width: 400px;
            animation: slideInScale 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;
        
        notification.innerHTML = `
            <div style="font-size: 1.3rem; margin-bottom: 0.5rem;">${title}</div>
            <div style="font-size: 1rem; opacity: 0.9;">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-30px) scale(0.9)';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
    
    static showPaymentErrorNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #ff6b6b, #ff8e53);
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 20px;
            font-weight: 700;
            z-index: 10001;
            box-shadow: 0 15px 40px rgba(255, 107, 107, 0.4);
            text-align: center;
            max-width: 400px;
            animation: slideInScale 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;
        
        notification.innerHTML = `
            <div style="font-size: 1.3rem; margin-bottom: 0.5rem;">❌ Payment Failed</div>
            <div style="font-size: 1rem; opacity: 0.9;">${message}</div>
            <button onclick="this.parentElement.remove()" 
                    style="margin-top: 1rem; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 0.5rem 1rem; border-radius: 15px; cursor: pointer;">
                Dismiss
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (notification && notification.parentElement) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(-50%) translateY(-30px) scale(0.9)';
                setTimeout(() => {
                    if (notification && notification.parentElement) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 8000);
    }
}

// ============================
// BUNDLE PRICING SYSTEM
// ============================

class BundleSystem {
    static showBundleModal(type) {
        if (type === 'photo') {
            this.showPhotoBundleModal();
        } else if (type === 'video') {
            this.showVideoBundleModal();
        }
    }
    
    static showPhotoBundleModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>📸 Photo Bundle Deal</h2>
                <div class="price-display">€0.80</div>
                <p>10 Photos Bundle - Save 20%!</p>
                <div style="margin: 1.5rem 0; text-align: left; padding: 0 1rem;">
                    <div style="margin-bottom: 0.5rem;">✅ Choose any 10 photos</div>
                    <div style="margin-bottom: 0.5rem;">✅ Full HD quality</div>
                    <div style="margin-bottom: 0.5rem;">✅ Instant download</div>
                    <div style="margin-bottom: 0.5rem;">✅ Save €0.20 vs individual</div>
                </div>
                <div id="bundlePaypalContainer" style="margin: 2rem 0;"></div>
                <button onclick="this.parentElement.parentElement.remove()" class="close-btn">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        PayPalRenderer.renderSinglePaymentButton(
            'bundlePaypalContainer',
            'photo_bundle_10',
            'bundle',
            PAYPAL_CONFIG.PRICES.PHOTO_BUNDLE_10,
            (contentId, contentType, data, details) => {
                this.handleBundleSuccess('photo', 10, data, details);
                modal.remove();
            }
        );
    }
    
    static showVideoBundleModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>🎬 Video Bundle Deal</h2>
                <div class="price-display">€1.20</div>
                <p>5 Videos Bundle - Save 20%!</p>
                <div style="margin: 1.5rem 0; text-align: left; padding: 0 1rem;">
                    <div style="margin-bottom: 0.5rem;">✅ Choose any 5 videos</div>
                    <div style="margin-bottom: 0.5rem;">✅ Full HD quality</div>
                    <div style="margin-bottom: 0.5rem;">✅ Instant download</div>
                    <div style="margin-bottom: 0.5rem;">✅ Save €0.30 vs individual</div>
                </div>
                <div id="bundlePaypalContainer" style="margin: 2rem 0;"></div>
                <button onclick="this.parentElement.parentElement.remove()" class="close-btn">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        PayPalRenderer.renderSinglePaymentButton(
            'bundlePaypalContainer',
            'video_bundle_5',
            'bundle',
            PAYPAL_CONFIG.PRICES.VIDEO_BUNDLE_5,
            (contentId, contentType, data, details) => {
                this.handleBundleSuccess('video', 5, data, details);
                modal.remove();
            }
        );
    }
    
    static handleBundleSuccess(type, count, data, details) {
        console.log(`🎉 ${type} bundle purchased: ${count} items`);
        
        // Store bundle credits
        const bundles = JSON.parse(localStorage.getItem('ibiza_bundles') || '{}');
        bundles[type] = (bundles[type] || 0) + count;
        localStorage.setItem('ibiza_bundles', JSON.stringify(bundles));
        
        PayPalRenderer.showPaymentSuccessNotification(
            `🎉 ${type.charAt(0).toUpperCase() + type.slice(1)} Bundle Activated!`,
            `You have ${count} ${type} credits to use. Click any locked ${type} to redeem!`
        );
    }
}

// ============================
// GLOBAL FUNCTIONS FOR MAIN GALLERY
// ============================

// Export functions for use in main.html
window.PayPalRenderer = PayPalRenderer;
window.PaymentTracker = PaymentTracker;
window.BundleSystem = BundleSystem;

// Backwards compatibility
window.renderPayPalSubscriptionButton = () => {
    PayPalRenderer.renderSubscriptionButton('paypalContainer');
};

window.renderPayPalSingleButton = (contentId, contentType, contentTitle, price) => {
    PayPalRenderer.renderSinglePaymentButton('ppvPaypalContainer', contentId, contentType, price);
};

// ============================
// CSS ANIMATIONS
// ============================

const animationCSS = `
    @keyframes slideInScale {
        0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-50px) scale(0.8);
        }
        100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
        }
    }
`;

const style = document.createElement('style');
style.textContent = animationCSS;
document.head.appendChild(style);

console.log('✅ PayPal Ocean Paradise Integration loaded!');
console.log('💳 Supported payments: VIP subscriptions, single content, bundles');
console.log('🌊 Ready for ocean paradise transactions!');