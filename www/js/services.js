angular.module('aghApp.services', [])

.factory('Login', function(){
    return {
        
    }
})

.factory('Jobs', function() {
    var jobs = [{
        id: 0,
        status: 0,
        name: 'Jane Forest',
        addressLine1: '12 Park Lane',
        addressLine2: 'Swinton',
        city: 'Manchester',
        postcode: 'M27 4EQ',
        hours: 8,
        materials: [{
            value:'Timber'
        }, {
            value:'Wire'
        }],
        work: 'Installed a plug socket',
        clientSignature: ''
    }, {
        id: 1,
        status: 2,
        name: 'Jane Forest',
        addressLine1: '9 Clement Road',
        addressLine2: 'Swinton',
        city: 'Manchester',
        postcode: 'M27 0IA',
        hours: 12,
        materials: [{
            value:'Timber'
        }, {
            value:'Wire'
        }],
        work: 'Installed a plug socket',
        clientSignature: ''
    }, {
        id: 2,
        status: 1,
        name: 'Liam Brullar',
        addressLine1: '19 Ashford Road',
        addressLine2: 'Swinton',
        city: 'Manchester',
        postcode: 'M27 8RU',
        hours: 6,
        materials: [{
            value:'Timber'
        }, {
            value:'Wire'
        }],
        work: 'Installed a plug socket',
        clientSignature: ''
    }];
    
    return {
        // TODO: Function to display certain status type (eg. success)
        retrieve: function() {
            // TODO: Retrieve jobs from server
        },
        getAll: function() {
            return jobs;
        },
        get: function(jobId) {
            // NOTE: Might be in wrong order, might need to search or sort.
            return jobs[jobId];
        },
        addJob: function() {
            var job = {
                id: jobs.length,
                status: 1,
                name: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                postcode: '',
                hours: '',
                materials: [],
                work: '',
                clientSignature: ''
            };
            
            jobs.push(job);
            
            return job;
        },
        addMaterial: function(job) {
            if (job.materials.length == 0) {
                job.materials.push({ value: '' });
            } else if(job.materials[job.materials.length - 1].value != '') {
                job.materials.push({ value: '' });
            }
        },
        removeMaterial: function(job, id) {
            job.materials.splice(id, 1);
        },
        deleteJob: function(job) {
            for (var x = 0; x < jobs.length; x++) {
                if (jobs[x].id == job.id) {
                    jobs.splice(x, 1);
                    return true;
                }
            }
        },
        clear: function() {
            // TODO: Remove all jobs
        },
        sendEmail: function(job) {
            if(window.plugins && window.plugins.emailComposer) {
                var subject = 'Job Complete Form: ' + job.addressLine1 + ',' + job.addressLine2 + ',' + job.postcode;
                var body = '<table>';
                body += '<tr><td>Name:</td><td>' + job.name + '</td></tr>';
                body += '<tr><td>Address:</td><td>' + job.addressLine1 + '</br>' + job.addressLine2 + '</br>' + job.postcode + '</td></tr>';
                body += '<tr><td>Hours:</td><td>' + job.hours + '</td></tr>';
                body += '<tr><td>Materials:</td><td>';
                for(var x = 0; x < job.materials.length; x++) {
                    body += job.materials[x].value + '</br>';
                }
                body += '</td></tr>';
                body += '<tr><td>Work Done:</td><td>' + job.work + '</td></tr>';
                // Insert client signature
                body += '</table>';
                
                window.plugins.emailComposer.showEmailComposerWithCallback(function (result) {
                        console.log("Email sent successfully");
                    },

                    subject,        // Subject
                    body,        // Body
                    'daniel.booth@dacan.co.uk',     // To (Email to send)
                    null,        // CC
                    null,        // BCC
                    true,       // isHTML
                    null,        // Attachments
                    null        // Attachment data
                );      
            }
        }
    };
})
// NOTE: Signature resets if going from job details tab to another and then back. Need to save signature on unload
.factory('SignatureCanvas', function() {
    var signaturePad;
    
    return {
        setCanvas: function(element) {
            signaturePad = new SignaturePad(document.getElementById(element));
            signaturePad.penColor = '#333';
        },
        clearCanvas: function() {
            signaturePad.clear();
        },
        saveImage: function(job) {
            if(!signaturePad.isEmpty()) {
                job.clientSignature = signaturePad.toDataURL();
            }
        },
        loadImage: function(job) {
            if(job.clientSignature != '') {
                signaturePad.fromDataURL(job.clientSignature);
            }
        }
    };
})