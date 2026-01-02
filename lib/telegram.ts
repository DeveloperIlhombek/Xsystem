import { TelegramUser, TelegramWebApp } from '@/types/telegram'

export const getTelegramWebApp = (): TelegramWebApp | null => {
	if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
		return window.Telegram.WebApp
	}
	return null
}

export const isTelegramWebApp = (): boolean => {
	return getTelegramWebApp() !== null
}

export const getTelegramUser = (): TelegramUser | null => {
	const webApp = getTelegramWebApp()
	if (webApp && webApp.initDataUnsafe.user) {
		return webApp.initDataUnsafe.user
	}
	return null
}

export const getTelegramInitData = (): string => {
	const webApp = getTelegramWebApp()
	return webApp?.initData || ''
}

export const initTelegramWebApp = () => {
	const webApp = getTelegramWebApp()
	if (webApp) {
		webApp.ready()
		webApp.expand()
		return true
	}
	return false
}

export const closeTelegramWebApp = () => {
	const webApp = getTelegramWebApp()
	if (webApp) {
		webApp.close()
	}
}

export const showTelegramAlert = (message: string) => {
	const webApp = getTelegramWebApp()
	if (webApp) {
		webApp.showAlert(message)
	} else {
		alert(message)
	}
}

export const showTelegramConfirm = (
	message: string,
	callback: (confirmed: boolean) => void
) => {
	const webApp = getTelegramWebApp()
	if (webApp) {
		webApp.showConfirm(message, callback)
	} else {
		const result = confirm(message)
		callback(result)
	}
}

export const applyTelegramTheme = () => {
	const webApp = getTelegramWebApp()
	if (webApp && typeof document !== 'undefined') {
		const themeParams = webApp.themeParams
		const root = document.documentElement

		if (themeParams.bg_color) {
			root.style.setProperty('--tg-bg-color', themeParams.bg_color)
		}
		if (themeParams.text_color) {
			root.style.setProperty('--tg-text-color', themeParams.text_color)
		}
		if (themeParams.button_color) {
			root.style.setProperty('--tg-button-color', themeParams.button_color)
		}
		if (themeParams.button_text_color) {
			root.style.setProperty(
				'--tg-button-text-color',
				themeParams.button_text_color
			)
		}
	}
}
