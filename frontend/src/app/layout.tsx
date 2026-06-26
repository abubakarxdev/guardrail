import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/toast'

export const metadata: Metadata = {
  title: 'GuardRail — Cloud Infrastructure Compliance Auditor',
  description: 'Audit Terraform & Kubernetes manifests for security misconfigurations and compliance posture analysis. Identify vulnerabilities before they reach production.',
  keywords: 'cloud security, terraform audit, kubernetes compliance, IaC security, CSPM, DevSecOps',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-grid antialiased">
        <ToastProvider>
          <div className="relative z-10">{children}</div>
        </ToastProvider>
      </body>
    </html>
  )
}
