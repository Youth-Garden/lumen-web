'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, Box, Command, Layers, Shield, Zap } from 'lucide-react';
import { Button } from '@lumen/uikit/components';
import { RouteEnum } from '@/shared/constants';

export default function HomePage() {
  const t = useTranslations('Index');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center px-4 mx-auto">
          <div className="mr-4 flex">
            <Link href={RouteEnum.HOME} className="mr-6 flex items-center space-x-2">
              <Command className="h-6 w-6 text-primary" />
              <span className="hidden font-bold sm:inline-block">
                Lumen
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href={RouteEnum.LOGIN}>
                <Button variant="ghost" size="sm">Đăng nhập</Button>
              </Link>
              <Link href={RouteEnum.REGISTER}>
                <Button size="sm">Bắt đầu ngay</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background pt-24 pb-32">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
          
          <div className="container px-4 mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                Phiên bản 1.0 đã chính thức ra mắt
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-8">
                Nền tảng quản lý <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  toàn diện cho doanh nghiệp
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Tối ưu hoá quy trình, nâng cao hiệu suất làm việc và quản lý mọi khía cạnh của doanh nghiệp bạn trên một nền tảng duy nhất, an toàn và mạnh mẽ.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link href={RouteEnum.REGISTER}>
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Bắt đầu miễn phí <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Khám phá tính năng
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-zinc-950/50 border-t border-border/50">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Tính năng nổi bật</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Mọi công cụ bạn cần để xây dựng và phát triển doanh nghiệp đều được tích hợp sẵn sàng.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-background rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Tốc độ chớp nhoáng</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Trải nghiệm người dùng mượt mà với độ trễ cực thấp, tối ưu hoá cho mọi thiết bị.
                </p>
              </div>

              <div className="bg-background rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Bảo mật tối đa</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Dữ liệu của bạn được mã hoá an toàn với các tiêu chuẩn bảo mật khắt khe nhất hiện nay.
                </p>
              </div>

              <div className="bg-background rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6">
                  <Layers className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Kiến trúc Microservices</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Mở rộng dễ dàng, không giới hạn quy mô phát triển nhờ kiến trúc hệ thống hiện đại.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 md:py-16">
        <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <Command className="h-5 w-5 text-primary" />
            <span className="font-bold">Lumen Platform</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Lumen Inc. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Điều khoản</Link>
            <Link href="#" className="hover:text-primary transition-colors">Bảo mật</Link>
            <Link href="#" className="hover:text-primary transition-colors">Liên hệ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
