// Telegram Web App Types
export interface TelegramWebApp {
	initData: string
	initDataUnsafe: TelegramInitData
	version: string
	platform: string
	colorScheme: 'light' | 'dark'
	themeParams: TelegramThemeParams
	isExpanded: boolean
	viewportHeight: number
	viewportStableHeight: number
	headerColor: string
	backgroundColor: string
	isClosingConfirmationEnabled: boolean
	BackButton: TelegramBackButton
	MainButton: TelegramMainButton
	HapticFeedback: TelegramHapticFeedback

	ready(): void
	expand(): void
	close(): void
	enableClosingConfirmation(): void
	disableClosingConfirmation(): void
	onEvent(eventType: string, callback: () => void): void
	offEvent(eventType: string, callback: () => void): void
	sendData(data: string): void
	openLink(url: string): void
	openTelegramLink(url: string): void
	showPopup(
		params: TelegramPopupParams,
		callback?: (buttonId: string) => void
	): void
	showAlert(message: string, callback?: () => void): void
	showConfirm(message: string, callback?: (confirmed: boolean) => void): void
	showScanQrPopup(
		params: TelegramScanQrParams,
		callback?: (text: string) => boolean
	): void
	closeScanQrPopup(): void
	readTextFromClipboard(callback?: (text: string) => void): void
}

export interface TelegramInitData {
	query_id?: string
	user?: TelegramUser
	receiver?: TelegramUser
	chat?: TelegramChat
	chat_type?: string
	chat_instance?: string
	start_param?: string
	can_send_after?: number
	auth_date: number
	hash: string
}

export interface TelegramUser {
	id: number
	is_bot?: boolean
	first_name: string
	last_name?: string
	username?: string
	language_code?: string
	is_premium?: boolean
	photo_url?: string
}

export interface TelegramChat {
	id: number
	type: string
	title: string
	username?: string
	photo_url?: string
}

export interface TelegramThemeParams {
	bg_color?: string
	text_color?: string
	hint_color?: string
	link_color?: string
	button_color?: string
	button_text_color?: string
	secondary_bg_color?: string
}

export interface TelegramBackButton {
	isVisible: boolean
	show(): void
	hide(): void
	onClick(callback: () => void): void
	offClick(callback: () => void): void
}

export interface TelegramMainButton {
	text: string
	color: string
	textColor: string
	isVisible: boolean
	isActive: boolean
	isProgressVisible: boolean
	setText(text: string): void
	onClick(callback: () => void): void
	offClick(callback: () => void): void
	show(): void
	hide(): void
	enable(): void
	disable(): void
	showProgress(leaveActive?: boolean): void
	hideProgress(): void
	setParams(params: TelegramMainButtonParams): void
}

export interface TelegramMainButtonParams {
	text?: string
	color?: string
	text_color?: string
	is_active?: boolean
	is_visible?: boolean
}

export interface TelegramHapticFeedback {
	impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void
	notificationOccurred(type: 'error' | 'success' | 'warning'): void
	selectionChanged(): void
}

export interface TelegramPopupParams {
	title?: string
	message: string
	buttons?: TelegramPopupButton[]
}

export interface TelegramPopupButton {
	id?: string
	type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
	text?: string
}

export interface TelegramScanQrParams {
	text?: string
}

declare global {
	interface Window {
		Telegram?: {
			WebApp: TelegramWebApp
		}
	}
}
