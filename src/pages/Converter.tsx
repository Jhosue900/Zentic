import { useState, useEffect } from 'react';
import { ArrowLeftRight, TrendingUp, RefreshCw, AlertTriangle } from 'lucide-react';
import { Currency } from '../types';
import { useCurrency, formatAmount, formatRate } from '../hooks/useCurrency';
import { CURRENCY_MAP } from '../data/Currencies.ts';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/SEO';

// ─── Grupos para el <select> con <optgroup> ───────────────────────────────────
const GROUPS = [
  {
    label: 'Big 5 — Mercados globales',
    codes: ['USD', 'EUR', 'GBP', 'JPY', 'CHF'] as Currency[],
  },
  {
    label: 'Latinoamérica',
    codes: ['MXN', 'COP', 'ARS', 'CLP', 'PEN'] as Currency[],
  },
  {
    label: 'Turismo y comercio',
    codes: ['CAD', 'AUD', 'CNY', 'BRL', 'TRY'] as Currency[],
  },
];

// ─── Pares populares para acceso rápido ──────────────────────────────────────
const HOT_PAIRS: [Currency, Currency][] = [
  ['USD', 'COP'],
  ['USD', 'MXN'],
  ['USD', 'ARS'],
  ['EUR', 'MXN'],
  ['USD', 'BRL'],
  ['GBP', 'USD'],
];

export function Converter() {
  const { t, language } = useLanguage();
  const { convert, rates, status, refetch, isUsingFallback } = useCurrency();
  const locale = language === 'es' ? 'es-CO' : 'en-US';

  const [amount,       setAmount]       = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<Currency>('USD');
  const [toCurrency,   setToCurrency]   = useState<Currency>('EUR');
  const [result,       setResult]       = useState<number>(0);

  useEffect(() => {
    const n = parseFloat(amount) || 0;
    setResult(convert(n, fromCurrency, toCurrency));
  }, [amount, fromCurrency, toCurrency, convert]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const applyPair = (from: Currency, to: Currency) => {
    setFromCurrency(from);
    setToCurrency(to);
  };

  const toMeta   = CURRENCY_MAP[toCurrency];
  const fromMeta = CURRENCY_MAP[fromCurrency];
  const unitRate = convert(1, fromCurrency, toCurrency);

  const title = language === 'es'
    ? `Conversor de Divisas — ${fromMeta.nameLong} a ${toMeta.nameLong} | FinTools`
    : `Currency Converter — ${fromMeta.name} to ${toMeta.name} | FinTools`;

  const description = language === 'es'
    ? `Convierte ${fromCurrency} a ${toCurrency} con tasas actualizadas en tiempo real. 1 ${fromCurrency} = ${formatRate(unitRate, toCurrency, locale)} ${toCurrency}.`
    : `Convert ${fromCurrency} to ${toCurrency} with real-time exchange rates. 1 ${fromCurrency} = ${formatRate(unitRate, toCurrency, locale)} ${toCurrency}.`;

  return (
    <>
      <SEO title={title} description={description} type="SoftwareApplication" />

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-2">
            {t('converter.title')}
          </h1>
          <p className="text-slate-400">{t('converter.subtitle')}</p>
        </header>

        {/* ── Fallback banner ── */}
        {isUsingFallback && (
          <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-amber-950/40 border border-amber-800/50 rounded-lg text-sm text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              {language === 'es'
                ? 'Usando tasas aproximadas. La API no está disponible.'
                : 'Using approximate rates. API unavailable.'}
            </span>
            <button
              onClick={refetch}
              className="ml-auto flex items-center gap-1 font-medium underline underline-offset-2 hover:text-amber-300"
            >
              <RefreshCw className="w-3 h-3" />
              {language === 'es' ? 'Reintentar' : 'Retry'}
            </button>
          </div>
        )}

        {/* ── Pares populares ── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {HOT_PAIRS.map(([from, to]) => (
            <button
              key={`${from}-${to}`}
              onClick={() => applyPair(from, to)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                fromCurrency === from && toCurrency === to
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500 hover:text-emerald-400 hover:bg-slate-700'
              }`}
            >
              {from} →  {to}
            </button>
          ))}
        </div>

        <section className="bg-slate-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-800 p-6 sm:p-8 mb-8">

          {/* ── Cantidad ── */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t('converter.amount')}
            </label>
            <input
              type="number"
              value={amount}
              min="0"
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 text-lg bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-100 placeholder:text-slate-500"
              placeholder="100"
            />
          </div>

          {/* ── De | ⇄ | A ── */}
          <div className="flex items-end gap-3 mb-6">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('converter.from')}
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value as Currency)}
                className="w-full px-4 py-3 text-base bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-100"
              >
                {GROUPS.map(g => (
                  <optgroup key={g.label} label={g.label} className="text-slate-400">
                    {g.codes.map(code => {
                      const m = CURRENCY_MAP[code];
                      return (
                        <option key={code} value={code} className="text-slate-100">
                           {code} — {m.name}
                        </option>
                      );
                    })}
                  </optgroup>
                ))}
              </select>
            </div>

            <button
              onClick={swapCurrencies}
              className="mb-0.5 p-3 rounded-full bg-slate-800 hover:bg-emerald-900/50 transition-all shrink-0 border border-slate-700 hover:border-emerald-500"
              aria-label="Intercambiar divisas"
            >
              <ArrowLeftRight className="w-5 h-5 text-slate-400 hover:text-emerald-400" />
            </button>

            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('converter.to')}
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value as Currency)}
                className="w-full px-4 py-3 text-base bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-100"
              >
                {GROUPS.map(g => (
                  <optgroup key={g.label} label={g.label} className="text-slate-400">
                    {g.codes.map(code => {
                      const m = CURRENCY_MAP[code];
                      return (
                        <option key={code} value={code} className="text-slate-100">
                           {code} — {m.name}
                        </option>
                      );
                    })}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          {/* ── Resultado ── */}
          <div className="bg-gradient-to-br from-emerald-950/40 to-slate-800/60 rounded-xl p-6 border border-emerald-800/50 backdrop-blur-sm">
            <div className="text-sm text-slate-400 mb-1">{t('converter.result')}</div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-4xl sm:text-5xl font-bold text-slate-100">
                {toMeta.symbol}{formatAmount(result, toCurrency, locale)}
              </span>
              <span className="text-lg text-slate-400 font-medium">{toCurrency}</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-400 flex-wrap">
              <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                status === 'loading' ? 'bg-amber-400 animate-pulse'
                : status === 'error' ? 'bg-red-400'
                : 'bg-emerald-400'
              }`} />
              <span>
                1 {fromCurrency} = {toMeta.symbol}{formatRate(unitRate, toCurrency, locale)} {toCurrency}
              </span>
              <span className="ml-auto">{rates.lastUpdate.toLocaleTimeString(locale)}</span>
            </div>
          </div>
        </section>

        {/* ── Tabla de tasas por grupo ── */}
        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-1 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            {t('converter.exchangeRates')}
          </h2>
          <p className="text-sm text-slate-400 mb-5">
            {language === 'es'
              ? `Valor de 1 unidad expresado en ${toMeta.nameLong} (${toCurrency}). Haz clic en una tarjeta para usarla como divisa origen.`
              : `Value of 1 unit expressed in ${toMeta.name} (${toCurrency}). Click a card to use it as the source currency.`}
          </p>

          {GROUPS.map(g => (
            <div key={g.label} className="mb-6">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                {g.label}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {g.codes.map(code => {
                  const meta     = CURRENCY_MAP[code];
                  const isTarget = code === toCurrency;
                  const isFrom   = code === fromCurrency;
                  const rate     = convert(1, code, toCurrency);

                  return (
                    <button
                      key={code}
                      onClick={() => !isTarget && setFromCurrency(code)}
                      disabled={isTarget}
                      className={`text-left rounded-xl border p-4 transition-all ${
                        isTarget
                          ? 'border-emerald-800/50 bg-emerald-950/40 cursor-default backdrop-blur-sm'
                          : isFrom
                          ? 'border-emerald-500 bg-emerald-950/60 hover:shadow-lg hover:shadow-emerald-900/30 cursor-pointer'
                          : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500 hover:bg-slate-800/80 cursor-pointer backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold tracking-wide ${
                          isTarget ? 'text-emerald-400' : 'text-slate-400'
                        }`}>
                          {code}
                        </span>
                        <span className="text-base leading-none">{meta.flag}</span>
                      </div>
                      <div className={`text-xs mb-2 leading-tight ${
                        isTarget ? 'text-slate-300' : 'text-slate-500'
                      }`}>
                        {meta.name}
                      </div>

                      {isTarget ? (
                        <div className="text-xs font-medium text-emerald-400">
                          {language === 'es' ? 'Divisa destino' : 'Target'}
                        </div>
                      ) : (
                        <div>
                          <div className="text-xs text-slate-500">1 {code} =</div>
                          <div className="text-sm font-bold text-emerald-400 leading-tight">
                            {toMeta.symbol}{formatRate(rate, toCurrency, locale)}
                          </div>
                          <div className="text-xs text-slate-500">{toCurrency}</div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      </article>
    </>
  );
}