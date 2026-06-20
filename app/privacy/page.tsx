import { Metadata } from 'next';
import { SimplePageLayout } from '@/components/SimplePageLayout';
import { FadeInTransition } from '@/components/FadeInTransition';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: `Informativa sulla Privacy | ${siteConfig.name}`,
  description: 'Informativa sul trattamento dei dati personali ai sensi del Regolamento Europeo (UE) 2016/679 (GDPR).',
  openGraph: {
    title: `Informativa sulla Privacy | ${siteConfig.name}`,
    description: 'Informativa sul trattamento dei dati personali ai sensi del Regolamento Europeo (UE) 2016/679 (GDPR).',
    type: 'website',
    url: '/privacy',
  },
};

export default function PrivacyPolicyPage() {
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
        'name': 'Privacy Policy',
        'item': `${baseUrl}/privacy`,
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
            <h1 className="font-serif italic text-5xl mb-12 text-zinc-900 dark:text-white">Privacy Policy</h1>
            
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-8 font-bold">Informativa ai sensi del Regolamento (UE) 2016/679 (GDPR)</p>

            <section className="mb-12">
              <h2 className="font-serif text-2xl mb-4 text-zinc-800 dark:text-zinc-200">Titolare del Trattamento</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Il titolare del trattamento dei dati è Landfall Archive, con sede legale e contatti indicati nella sezione dedicata del sito.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-serif text-2xl mb-4 text-zinc-800 dark:text-zinc-200">Finalità del trattamento</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                I dati personali raccolti tramite questo sito sono trattati per:
              </p>
              <ul className="text-zinc-600 dark:text-zinc-400 list-disc pl-6 space-y-2">
                <li>Fornire i servizi richiesti</li>
                <li>Analizzare le statistiche di navigazione (in forma aggregata)</li>
                <li>Inviare comunicazioni informative previo consenso</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="font-serif text-2xl mb-4 text-zinc-800 dark:text-zinc-200">Diritti dell'interessato</h2>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-none">
                Ai sensi del GDPR, hai il diritto di accedere ai tuoi dati, chiederne la rettifica, la cancellazione o la limitazione del trattamento. Puoi esercitare i tuoi diritti scrivendo a: <span className="text-emerald-500 font-mono">privacy@ethereal.test</span>
              </p>
            </section>
          </div>
        </FadeInTransition>
      </div>
    </SimplePageLayout>
  );
}
