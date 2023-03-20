$(document).ready(function () {

    var script_loaded = 0;

    $('#leiduhfy-me-submit').click(function (e) {
        e.preventDefault();
        if(script_loaded == 0) {

            $.getScript("//s3-eu-west-1.amazonaws.com/leiduhfy.swis.nl/leiduhfy.min.js", function(){
                $('#leiduhfy-me-submit').click();
            });
            script_loaded = 1;
            return;
        }
        if ($('#leiduhfy-me-text').val() === '') {
            $('#leiduhfied-text').html('Je mot wel wat invulleh jeh, bledder!<br /><span style="font-size: 12px">Juh, wat hebbie dan?  Een hijs op juh tetter ken je krijgeh ').slideDown()
        } else {
            $('#leiduhfied-text').html($('#leiduhfy-me-text').val()).slideDown();
            window.leiduhfy(
                domready,
                findAndReplaceDOMText,
                leiduhfy_dictonary,
                $('#leiduhfied-text')[0]
            );

        }
    });

    console.log('Kijk je vaker in de console? Solliciteer bij SWIS: https://www.swis.nl/werken-bij-swis?utm_source=teamrick&aanbrengbonus=true')
});