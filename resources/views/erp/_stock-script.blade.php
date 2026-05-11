<script>
function stockApp(initialJenis) {
    return {
        jenis: initialJenis, rows:[], total:0, page:1, perPage:20, loading:true, search:'',
        modal:false, saving:false, toast:'',
        form:{nama_produk:'',sku:'',tanggal:new Date().toISOString().slice(0,10),qty:1,satuan:'pcs',gudang_asal:'Gudang Utama',referensi:'',keterangan:''},
        async init() { await this.load(); },
        async load() {
            this.loading=true;
            try { const p=new URLSearchParams({search:this.search,jenis:this.jenis,page:this.page,per_page:this.perPage}); const d=await fetch('/api/erp/stock-mutations?'+p).then(r=>r.json()); this.rows=d.data||[]; this.total=d.total||0; }
            finally { this.loading=false; }
        },
        openCreate() { this.form={nama_produk:'',sku:'',tanggal:new Date().toISOString().slice(0,10),qty:1,satuan:'pcs',gudang_asal:'Gudang Utama',referensi:'',keterangan:''}; this.modal=true; },
        async save() {
            this.saving=true;
            try {
                const payload = {...this.form, jenis: this.jenis};
                const d=await fetch('/api/erp/stock-mutations',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(payload)}).then(r=>r.json());
                if(d.ok){this.modal=false;this.showToast('Mutasi stok disimpan');this.load();}else this.showToast('Gagal: '+(d.message||'Error'));
            } finally { this.saving=false; }
        },
        async del(id) { if(!confirm('Hapus data ini?'))return; await fetch(`/api/erp/stock-mutations/${id}`,{method:'DELETE',headers:{'X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''}}); this.showToast('Data dihapus'); this.load(); },
        prevPage(){if(this.page>1){this.page--;this.load();}},
        nextPage(){if(this.rows.length>=this.perPage){this.page++;this.load();}},
        showToast(msg){this.toast=msg;setTimeout(()=>this.toast='',3000);},
    };
}
</script>
