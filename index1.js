$(document).ready(function() {
    const startButton = $('#startButton');

    startButton.click(function() {
        const selectedStake = $('#stakeSelector').val();
        const infoUrl = `https://${selectedStake}/?tab=progress&modal=vip&app=Bonuscode`;
        const mainUrl = `index.html?selectedStake=${selectedStake}`;

        window.close();
        window.open(infoUrl, '_blank');
        window.open(mainUrl, '_blank');
    });
});