// Admin-provided QR code data (replace with your actual QR code's UPI URL)
const upiData = {
    vpa: '6375862443@ibl', // Replace with your VPA from the QR code (e.g., yourvpa@upi)
    payeeName: 'Ajay Saini', // Replace with your name from the QR code (e.g., Your Name)
};

// Get DOM elements
const paymentForm = document.getElementById('paymentForm');
const paymentStatus = document.getElementById('paymentStatus');

// Function to detect if the user is on a mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Handle form submission
paymentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const amount = document.getElementById('amount').value;
    
    // Validate amount
    if (!amount || amount <= 0) {
        paymentStatus.textContent = 'Please enter a valid amount.';
        return;
    }
    
    // Generate UPI deep link with proper encoding
    const upiLink = `upi://pay?pa=${encodeURIComponent(upiData.vpa)}&pn=${encodeURIComponent(upiData.payeeName)}&am=${encodeURIComponent(amount)}&cu=INR`;
    
    // Check if the user is on a mobile device
    if (!isMobileDevice()) {
        paymentStatus.textContent = 'Please use a mobile device with a UPI app installed to make the payment.';
        return;
    }
    
    // Display processing message
    paymentStatus.textContent = `Redirecting to UPI app for ${amount} INR payment...`;
    
    // Attempt to redirect to UPI app
    try {
        const startTime = Date.now();
        window.location.href = upiLink;
        
        // Check if the redirection worked (if the page is still active after 3 seconds, it likely failed)
        setTimeout(() => {
            const timeElapsed = Date.now() - startTime;
            if (timeElapsed < 2500) {
                // If less than 2.5 seconds have passed, the page might have redirected successfully
                return;
            }
            paymentStatus.textContent = 'Failed to open UPI app. Please ensure a UPI app (e.g., Google Pay, PhonePe) is installed, or try again.';
        }, 3000);
        
        // Simulate payment success (as we can't verify without APIs)
        setTimeout(() => {
            paymentStatus.textContent = `Payment of ${amount} INR to ${upiData.vpa} completed successfully (simulated).`;
            paymentForm.reset();
        }, 5000); // Assume success after 5 seconds to allow time for UPI app interaction
    } catch (error) {
        paymentStatus.textContent = 'Error: Unable to redirect to UPI app. Please try again or install a UPI app.';
        console.error('Redirection error:', error);
    }
});