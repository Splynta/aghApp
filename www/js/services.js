angular.module('aghApp.services', [])

.factory('Login', function(){
    return {
        
    }
})

.factory('Jobs', function() {
    var jobs = [];
    
    return {
        retrieve: function() {
            var query = 'SELECT * FROM jobs';
            db.executeSql(query, ['select-jobs'], function(res) {
                for(var x = 0; x < res.rows.length; x++) {
                    // insert into jobs variable
                    var row = res.rows.item(x);
                    var job = {
                        id: row.id,
                        status: row.status,
                        name: row.name,
                        addressLine1: row.addressline1,
                        addressLine2: row.addressline2,
                        city: row.city,
                        postcode: row.postcode,
                        hours: row.hours,
                        materials: [],
                        work: row.workdone,
                        clientSignature: row.clientsignature
                    };
                    
                    if(row.materials != null) {
                        var materials = row.materials.split('~');
                        for(var y = 0; y < materials.length; y++) {
                            job.materials.push({value: materials[y]});
                        }
                    }
                    
                    jobs.push(job);
                }
            }, errorsqlcb);
        },
        getAll: function() {
            return jobs;
        },
        get: function(jobId) {
            for(var x = 0; x < jobs.length; x++) {
                if(jobs[x].id == jobId) {
                    return jobs[x];
                }
            }
            
            return false;
        },
        createJob: function() {
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
            
            return job;
        },
        addJob: function(job) {
            var materials = '';
            for (var x = 0; x < job.materials.length; x++) {
                materials += job.materials[x].value;
                
                if(x != job.materials.length - 1) {
                    materials += '~';
                }
            }
            
            var query = 'INSERT INTO jobs (status, name, addressline1, addressline2, city, postcode, hours, materials, workdone, clientsignature) VALUES(';
            query += '1, '; // status
            query += '"' + job.name + '", ';
            query += '"' + job.addressLine1 + '", ';
            query += '"' + job.addressLine2 + '", ';
            query += '"' + job.city + '", ';
            query += '"' + job.postcode + '", ';
            // TODO: Change hours to something that can only input numbers.
            if (job.hours == '') job.hours = 0; // Check if hours is blank.
            query += job.hours + ', ';
            query += '"' + materials + '", ';
            query += '"' + job.work + '", ';
            query += '"' + job.clientSignature + '"';
            query += ')';
            
            db.executeSql(query, ['insert-new-job'], function(res) {
                job.id = res.insertId; // Add insert id to jobs id
                jobs.push(job);
                return true;
            }, errorsqlcb);
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
        saveJob: function(job) {
            var materials = '';
            for (var x = 0; x < job.materials.length; x++) {
                materials += job.materials[x].value;
                
                if(x != job.materials.length - 1) {
                    materials += '~';
                }
            }
            
            var query = 'UPDATE jobs SET ';
            query += 'name="' + job.name + '",';
            query += 'addressline1="' + job.addressLine1 + '",';
            query += 'addressline2="' + job.addressLine2 + '",';
            query += 'city="' + job.city + '",';
            query += 'postcode="' + job.postcode + '",';
            query += 'hours=' + job.hours + ',';
            query += 'workdone="' + job.work + '",';
            query += 'materials="' + materials + '",';
            query += 'clientsignature="' + job.clientSignature + '"';
            query += 'WHERE id = ' + job.id;
            
            db.executeSql(query, ['select-jobs'], function(res) {
                // Result action
                console.log('saveJob called and completed');
            }, errorsqlcb);
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
            } else {
                console.log('emailComposer plugin not present');
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
            var ratio =  Math.max(window.devicePixelRatio || 1, 1);
    signaturePad.width = signaturePad.offsetWidth * ratio;
    signaturePad.height = signaturePad.offsetHeight * ratio;
    //signaturePad.getContext("2d").scale(ratio, ratio);
    signaturePad.clear();
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