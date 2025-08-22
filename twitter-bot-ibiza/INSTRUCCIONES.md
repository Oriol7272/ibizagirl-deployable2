# ===============================================
# INSTRUCCIONES PARA EL BOT DE TWITTER CORREGIDO
# ===============================================

## ✅ PROBLEMAS SOLUCIONADOS:

1. **ERROR 429 (Rate Limiting)**:
   - Límite conservador: 10 tweets/15min (real es 17)
   - Delay mínimo: 3 minutos entre tweets
   - Reintentos con exponential backoff
   - Reset automático de contadores

2. **Rutas de imagen corregidas**:
   - Busca en múltiples directorios posibles
   - Soporte para .webp, .jpg, .jpeg, .png
   - Fallback a tweet de texto si no hay imágenes

3. **Manejo robusto de errores**:
   - Reintentos inteligentes
   - Logging detallado
   - Recuperación automática

4. **Programación menos agresiva**:
   - 3 tweets con imagen/día (cada 8 horas)
   - 2 tweets de texto/día (cada 12 horas)
   - 1 tweet de actualización/día

## 🚀 CÓMO USAR:

### 1. Instalar dependencias:
```bash
cd /app/twitter-bot-ibiza
npm install
```

### 2. Verificar credenciales:
```bash
npm run check
```

### 3. Ejecutar bot:
```bash
npm start
```

### 4. Monitorear logs:
```bash
tail -f logs/twitter-bot.log
```

## 📊 ESTADÍSTICAS EN TIEMPO REAL:

El bot muestra:
- ✅ Tweets publicados exitosamente
- ❌ Errores y reintentos
- ⏰ Próximo tweet programado
- 🔒 Estado del rate limiting

## 🛡️ PROTECCIONES INCLUIDAS:

- **Anti-429**: Rate limiting inteligente
- **Anti-duplicados**: Templates rotativos
- **Auto-recovery**: Reinicia después de errores
- **Logs detallados**: Para debugging

## ⚠️ IMPORTANTE:

- **NO ejecutar** el bot anterior (twitter-bot.js)
- **SOLO usar** twitter-bot-FIXED.js
- El bot necesita encontrar imágenes en ../full/
- Mínimo delay de 3 minutos entre tweets