$(document).ready(function() {
    const startButton = $('#startButton');

    startButton.click(function() {
        const selectedStake = $('#stakeSelector').val();
        const infoUrl = `https://${selectedStake}/casino/home?tab=progress&modal=vip`;
        const mainUrl = `index.html`;

        // Open the URLs in new tabs/windows
        window.close();
        window.open(infoUrl, '_blank');
        window.open(mainUrl, '_blank');
    });
});
