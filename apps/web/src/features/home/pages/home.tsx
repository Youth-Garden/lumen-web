'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, Variants } from 'framer-motion';
import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';
import { RouteEnum } from '@/shared/constants';
import { cn } from '@lumen/uikit/utils';

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function HomePage() {
  const t = useTranslations('Index');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center px-4 mx-auto justify-between">
          <Link href={RouteEnum.HOME} className="flex items-center space-x-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <Icons name="command" className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">Lumen</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link href={RouteEnum.LOGIN}>
              <Button variant="ghost" className="hidden sm:inline-flex min-h-[44px]">
                {t('login')}
              </Button>
            </Link>
            <Link href={RouteEnum.REGISTER}>
              <Button className="min-h-[44px] rounded-full px-6 shadow-sm hover:shadow-md transition-all">
                {t('startNow')}
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32">
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-[600px] rounded-full bg-primary/20 opacity-30 blur-[120px]" />
          <div className="absolute -left-32 top-32 -z-10 h-[300px] w-[300px] rounded-full bg-indigo-500/20 opacity-30 blur-[100px]" />
          <div className="absolute -right-32 top-64 -z-10 h-[300px] w-[300px] rounded-full bg-emerald-500/20 opacity-30 blur-[100px]" />

          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              show: { transition: { staggerChildren: 0.1 } }
            }}
            className="container px-4 mx-auto text-center relative z-10"
          >
            <div className="mx-auto max-w-4xl flex flex-col items-center">
              <motion.div variants={fadeUpVariants} className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2 mr-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {t('versionLaunched')}
              </motion.div>
              
              <motion.h1 variants={fadeUpVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
                <span className="block text-foreground">{t('heroTitle1')}</span>
                <span className="block mt-2 bg-gradient-to-r from-primary via-indigo-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  {t('heroTitle2')}
                </span>
              </motion.h1>
              
              <motion.p variants={fadeUpVariants} className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-2xl leading-relaxed font-medium">
                {t('heroSubtitle')}
              </motion.p>
              
              <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
                <Link href={RouteEnum.REGISTER} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2 min-h-[56px] text-lg rounded-full px-8 shadow-lg hover:shadow-xl transition-all group">
                    {t('startFree')} 
                    <Icons name="arrow-right" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="#features" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto min-h-[56px] text-lg rounded-full px-8 border-border/60 hover:bg-muted"
                  >
                    {t('exploreFeatures')}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-32 bg-zinc-50 dark:bg-zinc-900/20 relative"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <div className="container px-4 mx-auto max-w-6xl">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                {t('featuresTitle')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('featuresSubtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* TOEIC Mock Test */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 relative z-10 text-primary">
                  <Icons name="file-question" className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{t('featureToeicTitle')}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t('featureToeicDesc')}
                </p>
              </motion.div>

              {/* Dictation */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 relative z-10 text-indigo-600 dark:text-indigo-400">
                  <Icons name="headphones" className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{t('featureDictationTitle')}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t('featureDictationDesc')}
                </p>
              </motion.div>

              {/* Vocabulary */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 relative z-10 text-emerald-600 dark:text-emerald-400">
                  <Icons name="brain" className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{t('featureVocabTitle')}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t('featureVocabDesc')}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card">
        <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Icons name="command" className="h-4 w-4" />
            </div>
            <span className="font-bold text-lg">Lumen Platform</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Lumen Inc. {t('allRightsReserved')}
          </p>
          <div className="flex space-x-6 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors py-2">
              {t('terms')}
            </Link>
            <Link href="#" className="hover:text-primary transition-colors py-2">
              {t('privacy')}
            </Link>
            <Link href="#" className="hover:text-primary transition-colors py-2">
              {t('contact')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
