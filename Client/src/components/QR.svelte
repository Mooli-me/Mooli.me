<script>
    export var data;
    export var size = null;

    import QRCode from 'qrcode';

    var qr = QRCode.toDataURL(data, {width: size});

</script>

<div>
{#await qr }
    <p>...</p>
{:then url} 
    <img alt="qr code" src={url}/>
{/await}
</div>


<style></style>

