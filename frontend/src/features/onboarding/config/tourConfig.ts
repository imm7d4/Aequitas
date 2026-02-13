import { Step, Placement } from 'react-joyride';


export const getTourSteps = (relianceId?: string): Step[] => [
    {
        target: 'body',
        content: 'Welcome to Aequitas! This quick tour will guide you through the key features of the platform.',
        placement: 'center' as Placement,
        disableBeacon: true,
        data: { route: '/dashboard' }
    },
    {
        target: '#dashboard-overview',
        content: 'This is your Dashboard. Here you can see a summary of your portfolio performance, recent activities, and market overview.',
        placement: 'bottom' as Placement,
        data: { route: '/dashboard' }
    },
    {
        target: '#user-menu',
        content: 'Manage your profile, settings, and security preferences from the user menu.',
        placement: 'bottom-end' as Placement,
        data: { route: '/dashboard' }
    },
    {
        target: '#profile-container',
        content: 'Here in your Profile, you can manage your personal details.',
        placement: 'center' as Placement,
        data: { route: '/profile' }
    },
    {
        target: '#profile-finance-tab',
        content: 'The Finance section is where you manage your funds, deposits, and withdrawals.',
        placement: 'bottom' as Placement,
        data: { route: '/profile' }
    },
    {
        target: '#market-data-nav',
        content: 'Navigate to Instruments to explore the market.',
        placement: 'right' as Placement,
        data: { route: '/profile' } // Start from profile, point to sidebar
    },
    {
        target: '#instrument-list-container',
        content: 'This is the Instrument List. You can search, filter, and sort instruments here.',
        placement: 'center' as Placement,
        data: { route: '/instruments' }
    },
    ...(relianceId ? [{
        target: 'body', // Fallback if specific element not ready immediately, or just a transition step
        content: 'Let\'s explore the details of RELIANCE.',
        placement: 'center' as Placement,
        data: { route: `/instruments/${relianceId}` }
    }] : []),
    ...(relianceId ? [{
        target: '#indicator-panel',
        content: 'Analyze price trends with customizable technical indicators like SMA, EMA, RSI, and MACD.',
        placement: 'bottom' as Placement,
        data: { route: `/instruments/${relianceId}` }
    }] : []),
    ...(relianceId ? [{
        target: '#trade-panel',
        content: 'Execute trades quickly with our advanced order panel.',
        placement: 'left' as Placement,
        data: { route: `/instruments/${relianceId}` }
    }] : []),
    ...(relianceId ? [{
        target: '#set-alert-btn',
        content: 'Never miss a move! Set price alerts to get notified when the market hits your target.',
        placement: 'bottom' as Placement,
        data: { route: `/instruments/${relianceId}` }
    }] : []),
    {
        target: '#watchlists-nav',
        content: 'Create and manage custom Watchlists to track your favorite stocks.',
        placement: 'right' as Placement,
        data: { route: '/dashboard' } // Navigate back to dashboard context for sidebar tour
    },
    {
        target: '#diagnostics-nav',
        content: 'Use Diagnostics to analyze your trading patterns and improve your strategy.',
        placement: 'right' as Placement,
        data: { route: '/dashboard' }
    },
    {
        target: '#orders-nav',
        content: 'View your Order Book to track open, executed, and cancelled orders.',
        placement: 'right' as Placement,
        data: { route: '/dashboard' }
    },
    {
        target: '#education-nav',
        content: 'Access educational resources to enhance your trading knowledge.',
        placement: 'right' as Placement,
        data: { route: '/dashboard' }
    },
    {
        target: '#dashboard-nav',
        content: 'That\'s it! You are ready to start trading. Click here to return to your Dashboard.',
        placement: 'right' as Placement,
        data: { route: '/dashboard' }
    }
];

export const tourStyles = {
    options: {
        zIndex: 10000,
        primaryColor: '#0066CC', // Adjust to match theme
        textColor: '#333',
        backgroundColor: '#fff',
        arrowColor: '#fff',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
};
