import "./globals.css";

export const metadata = {
  title: "Harnais Mon",
  description: "Agentique Intelligent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}