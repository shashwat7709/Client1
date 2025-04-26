import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"./index.html",
		"./src/**/*.{js,jsx}"
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				saffron: '#FF9933',
				indianRed: '#C41E3A',
				peacockBlue: '#0C6B58',
				turmeric: '#FFC72C',
				mehendi: '#2D5A27',
				lotus: '#FE85A0',
				gold: "#D4AF37",
				ivory: "#FFFFF0",
				ebony: "#282321",
				maroon: "#800000"
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'slow-shine': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '200% 50%' },
					'100%': { backgroundPosition: '-200% 50%' }
				},
				'reveal-carving': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'wax-seal': {
					'0%': { transform: 'scale(0.8)', opacity: '0' },
					'50%': { transform: 'scale(1.1)', opacity: '0.5' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 1.5s ease-out forwards',
				'slow-shine': 'slow-shine 8s ease infinite',
				'shimmer': 'shimmer 3s linear infinite',
				'reveal-carving': 'reveal-carving 0.5s ease-out forwards',
				'wax-seal': 'wax-seal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards'
			},
			backgroundImage: {
				'texture-pattern': "url('/texture-pattern.jpg')",
				'hero-bg': "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('/hero-bg.jpg')",
				'paisley-pattern': "url('/patterns/paisley.png')",
				'mandala-light': "url('/patterns/mandala-light.png')",
				'mandala-dark': "url('/patterns/mandala-dark.png')",
				'border-pattern': "url('/patterns/border.png')",
				'pichwai-pattern': "url('/patterns/pichwai.png')",
				'mughal-pattern': "url('/patterns/mughal.png')",
				'brocade-pattern': "url('/patterns/brocade.png')",
				'filigree-pattern': "url('/patterns/filigree.png')",
				'aged-paper': "url('/patterns/aged-paper.png')",
				'heritage-gradient': "linear-gradient(to right, #C7A008, #7B1113, #005F56)",
				'gold-shimmer': "linear-gradient(45deg, #C7A008 0%, #E5C34D 25%, #C7A008 50%, #9E7D06 75%, #C7A008 100%)"
			},
			fontFamily: {
				sans: ["var(--font-sans)", ...fontFamily.sans],
				serif: ["Rozha One", ...fontFamily.serif],
				display: ["Playfair Display", ...fontFamily.serif],
				decorative: ["EB Garamond", ...fontFamily.serif],
				body: ["Lora", ...fontFamily.serif],
				signature: ["Petit Formal Script", ...fontFamily.serif]
			},
			boxShadow: {
				'gold': '0 0 15px rgba(199, 160, 8, 0.3)',
				'carved': '0 10px 30px -5px rgba(44, 30, 30, 0.3)',
				'embossed': 'inset 0 2px 4px rgba(44, 30, 30, 0.1)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
