import { Metadata } from 'next';
import { SimplePageLayout } from '@/components/SimplePageLayout';
import { FadeInTransition } from '@/components/FadeInTransition';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: `Informativa sui Cookie | ${siteConfig.name}`,
  description: "Informativa estesa sull'uso dei cookie e degli altri strumenti di tracciamento attivi e passivi, in conformità con le linee guida italiane del Garante Privacy.",
  openGraph: {
    title: `Informativa sui Cookie | ${siteConfig.name}`,
    description: "Informativa estesa sull'uso dei cookie e degli altri strumenti di tracciamento attivi e passivi, in conformità con le linee guida italiane del Garante Privacy.",
    type: 'website',
    url: '/cookie',
  },
};

export default function CookiePolicyPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ais-pre-wyhzrhrdp7vgwnfrtmw67b-13320223187.europe-west1.run.app';

  // Breadcrumb schema LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': baseUrl,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Cookie Policy',
        'item': `${baseUrl}/cookie`,
      },
    ],
  };

  return (
    <SimplePageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
        <FadeInTransition>
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <h1 className="font-serif italic text-5xl mb-12 text-zinc-900 dark:text-white">Cookie Policy</h1>
            
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-8 font-bold">Ultimo aggiornamento: 17 Giugno 2026</p>

            <section className="mb-12">
              <h2 className="font-serif text-2xl mb-4 text-zinc-800 dark:text-zinc-200">Cosa sono i cookie</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                I cookie sono piccoli file di testo che i siti visitati dagli utenti inviano ai loro terminali, dove vengono memorizzati per essere ritrasmessi agli stessi siti in occasione di visite successive. Il nostro sito utilizza cookie tecnici e, previo tuo consenso, cookie di profilazione o altri strumenti di tracciamento.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-serif text-2xl mb-4 text-zinc-800 dark:text-zinc-200">Tipologie di cookie utilizzati</h2>
              <div className="space-y-8">
                <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <h3 className="text-lg font-bold mb-2 text-zinc-800 dark:text-zinc-200">1. Cookie Tecnici</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Necessari per il corretto funzionamento delle funzioni di base del sito, come la navigazione delle pagine e l'accesso alle aree protette. Il sito non può funzionare correttamente senza questi cookie.</p>
                </div>
                <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <h3 className="text-lg font-bold mb-2 text-zinc-800 dark:text-zinc-200">2. Cookie Statistici (Analytics)</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Ci aiutano a capire come i visitatori interagiscono con il sito raccogliendo e trasmettendo informazioni in forma anonima.</p>
                </div>
                <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <h3 className="text-lg font-bold mb-2 text-zinc-800 dark:text-zinc-200">3. Cookie di Marketing</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Vengono utilizzati per tracciare i visitatori sui siti web. L'intento è quello di visualizzare annunci pertinenti e coinvolgenti per il singolo utente.</p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-serif text-2xl mb-4 text-zinc-800 dark:text-zinc-200">Gestione del consenso</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Puoi modificare le tue preferenze in qualsiasi momento cliccando sull'icona dello scudo (<span className="text-emerald-500 underline decoration-emerald-500/30">Privacy Preference</span>) in basso a sinistra in ogni pagina del sito.
              </p>
            </section>
          </div>
        </FadeInTransition>
      </div>
    </SimplePageLayout>
  );
}
