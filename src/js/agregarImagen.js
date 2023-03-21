import { Dropzone } from 'dropzone'

const token = document.querySelector("input[name='_csrf']").getAttribute('value')

// console.log(token);
Dropzone.options.imagen = {
    dictDefaultMessage: "Arrastra tus fotos AQUI",
    autoProcessQueue: false,
    acceptedFiles: '.png,.jpe,.jpg',
    dictInvalidFileType: "No puedes subir este tipo de archivo",
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    addRemoveLinks: true,
    dictRemoveFile: "Borrar Archivo",
    dictMaxFilesExceeded: "No puedes subir mas de 1 archivo a la vez",
    headers: {
        "X-CSRF-TOKEN": token
    },
    paramName: 'imagen',
    init: function () {
        const dropzone = this
        const btnPublicar = document.querySelector("#publicar")

        btnPublicar.addEventListener('click', function () {
            dropzone.processQueue()
        })

        dropzone.on('queuecomplete', () => {
            if (dropzone.getActiveFiles().length == 0) {
                window.location.href = '/mis-propiedades'
            }

        })

    }

}