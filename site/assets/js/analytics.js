// Google Analytics (gtag.js), shared by every page. Load with:
// <script defer src="assets/js/analytics.js"></script>  (adjust the path for subfolders)
(function () {
    var id = 'G-TE3FHFGW3S';
    var loader = document.createElement('script');
    loader.async = true;
    loader.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(loader);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id);
})();
