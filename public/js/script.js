(function () {

    Vue.component('first-component', {
        template: "#template",
        data: () => {
            return {
                comment: '',
                username: '',
                imagesData: [],
                userComments: []
            };
        },
        props: ['selectedImage'],
        mounted: function () {
            axios.get(`/modal?id=${this.selectedImage}`).then(result => {
                let { url, username, title, description } = result.data;
                this.imagesData = { url, username, title, description };
            }).catch(error => {
                console.log(error);
            });

            axios.get(`/comments?id=${this.selectedImage}`).then(result => {
                this.userComments = result.data;
            }).catch(error => {
                console.log(error.message);
            });
        },
        watch: {
            selectedImage: function () {
                axios.get(`/modal?id=${this.selectedImage}`).then(result => {
                    let { url, username, title, description } = result.data;
                    this.imagesData = { url, username, title, description };
                }).catch(error => {
                    console.log(error);
                });

                axios.get(`/comments?id=${this.selectedImage}`).then(result => {
                    this.userComments = result.data;
                }).catch(error => {
                    console.log(error.message);
                });
            }
        },
        methods: {
            submit: function () {

                let commentsData = {
                    comment: this.comment,
                    username: this.username,
                    image_id: this.selectedImage
                };

                axios.post('/comments', commentsData).then(({ data }) => {
                    this.userComments.unshift(data[0]);
                }).catch(error => {
                    console.log(error.message);
                    this.error = true;
                });
            },
            closeModal: function () {
                this.$emit('close');
            },
            deleteImgEvent: function () {
                axios.post(`/delete/${this.selectedImage}`).then(result => {
                    this.$emit('set', result.data);
                }).then(() => this.$emit('close'));

                axios.post(`/comments/${this.selectedImage}`);
            }
        }
    });


    new Vue({
        el: "#main",
        data: {
            header: "UPLOAD images...",
            className: "image",
            imagesArr: [],
            username: null,
            description: null,
            title: null,
            file: null,
            showBtn: true,
            checkForm: function (title, description, username, file) {
                this.errors = [];

                if (!title) {
                    this.errors.push("Title required.");
                } else if (!description) {
                    this.errors.push("Description required.");
                } else if (!username) {
                    this.errors.push("Username required.");
                } else if (!file) {
                    this.errors.push("File required.");
                }

                if (file.size > 2024 * 1024) {
                    alert('File size is too big (<2MB)');
                    return;
                }

                if (!this.errors.length) {
                    setTimeout(() => {
                        this.errors.push("Successful.");
                    }, 3000);
                    return true;
                }
            },
            errors: [],
            selectedImage: location.hash.slice(1)
        },
        mounted: function () {
            axios.get('/images').then((res) => {
                this.imagesArr = res.data;
            }).catch(error => {
                console.log(error.message);
            });

            addEventListener('hashchange', () => {
                this.selectedImage = location.hash.slice(1);
            });
        },
        updated: function () {
            console.log(this.imagesArr);
            console.log(this.showBtn);
        },
        methods: {
            cleanHash: function () {
                this.selectedImage = null;
                history.replaceState(null, null, ' ');
            },
            upload: function () {
                let fd = new FormData;
                fd.append('image', this.file);
                fd.append('username', this.username);
                fd.append('title', this.title);
                fd.append('description', this.description);

                this.checkForm(this.title, this.description, this.username, this.file);

                axios.post('/upload', fd).then(result => {
                    this.imagesArr.unshift(result.data);

                }).catch(error => {
                    console.log(error.message);
                });
            },
            fileselected: function (e) {
                this.file = e.target.files[0];
            },
            moreImages: function () {
                let lowest_id = this.imagesArr.slice(-1)[0].id;
                axios.get(`/moreImages?id=${lowest_id}`).then(({ data }) => {

                    for (let i = 0; i < data.length; i++) {
                        if (data[i].id === data[i].lowest_id) {
                            this.showBtn = false;
                        }
                        this.imagesArr.push(data[i]);
                    }

                }).catch(error => {
                    console.log(error);
                });
            },
            updateImgRow: function (data) {
                this.imagesArr = data;
            },
            updateImgRow: function (data) {
                this.imagesArr = data;
            }
        }
    });
})();