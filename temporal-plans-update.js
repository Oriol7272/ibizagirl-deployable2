// Planes temporales actualizados
const temporalPlans = {
    day: { price: 2.99, hours: 24, description: "Acceso 24 horas" },
    weekend: { price: 7.99, hours: 72, description: "Fin de semana (72h)" }
};

// Estos requieren creación en PayPal Dashboard
function purchaseTemporalAccess(plan) {
    showPayPalButton(`temporal_${plan}`, temporalPlans[plan].price, temporalPlans[plan].description);
}
