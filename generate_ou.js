
const r2 = require('r2');
import {
    appConfig,
    getAuthorizationString
} from './config/app.config';
const baseUrl = appConfig.url;
const Authorization = getAuthorizationString(appConfig.username, appConfig.password);
function getOrganisationUnits() {
    const url = `${baseUrl}/api/29/organisationUnits.json?filter=level:in:[2,3]&fields=id,displayName,parent[id],level&paging=false`;
    //const url = `${baseUrl}/api/29/organisationUnits.json?page=${page}&filter=id:eq:EjxCAxGdiZ8&fields=id,name,phoneNumber,attributeValues`;
    console.log('Org Unit:', url);
    return r2.get(url, {
        headers: {
            Authorization
        }
    }).json;
}

function getStore() {
    const url = `${baseUrl}/api/29/dataStore/ussd/covid19tracker`;
    //const url = `${baseUrl}/api/29/organisationUnits.json?page=${page}&filter=id:eq:EjxCAxGdiZ8&fields=id,name,phoneNumber,attributeValues`;
    console.log('Org Unit:', url);
    return r2.get(url, {
        headers: {
            Authorization
        }
    }).json;
}
function uploadStore(data) {
    const url = `${baseUrl}/api/29/dataStore/ussd/covid19tracker`;
    //const url = `${baseUrl}/api/29/organisationUnits.json?page=${page}&filter=id:eq:EjxCAxGdiZ8&fields=id,name,phoneNumber,attributeValues`;
    console.log('Org Unit:', url);
    return r2.put(url, {
        headers: {
            Authorization
        },
        json: data
    }).json;
}

getOrganisationUnits().then(async (results)=>{
    let store = await getStore();
    //console.log(results);
    var groups = [
        {
            next_menu_id: 'kh3b7JAtCJ6by5jMBbjjhgmtwBdrOcP6X',
            list: ['A','D','G','I']
        },
        {
            next_menu_id: 'kh3b7JAtCJ6by5jMBbjjhgmtwBdrOcP6X1',
            list: ['K','L']
        },
        {
            next_menu_id: 'kh3b7JAtCJ6by5jMBbjjhgmtwBdrOcP6X2',
            list: ['M','N']
        },
        {
            next_menu_id: 'kh3b7JAtCJ6by5jMBbjjhgmtwBdrOcP6X3',
            list: ['P','R','S','T']
        }
    ];
    store.menus['kh3b7JAtCJ6by5jMBbaFmtwBdrOcP3X'].options = groups.map((group, index)=>{
        return {
            title: group.list.join(', '),
            response: "" + (index + 1),
            next_menu: group.next_menu_id
        }
    });
    let regions = results.organisationUnits.filter((organisationUnit)=> organisationUnit.level == 2);
    let districts = results.organisationUnits.filter((organisationUnit)=> organisationUnit.level == 3);
    for(let group of groups){
        let organisationUnits = regions.filter((organisationUnit)=>
        group.list.indexOf(organisationUnit.displayName[0]) > -1)
        if(!store.menus[group.next_menu_id]){
            store.menus[group.next_menu_id] = {
                "id": group.next_menu_id,
                "type": "options",
                "title": "Chagua namba yenye mkoa unaoishi",
                "data_id": "",
                "options": [
                  {
                    "id": "utvJByKIGFR8G8ujsdsdnkciTRqmXndNHCaw",
                    "title": "Arusha",
                    "response": "1",
                    "next_menu": "kh3b7JAtjn77nd9dfb8jhgmtwBdrOcP6X"
                  },
                  {
                    "id": "tvKsdns836CiPzv6PjQqusn5oou49Arrvrpf",
                    "title": "Dar es salaam",
                    "response": "2",
                    "next_menu": "kh3b7JAtjn7i8i8i8i097jhbhgmtwBdrOcP6X"
                  },
                  {
                    "id": "tvKfMwdsCiPzv6Pjcsdbusn5oosdkjcn883nd8vrpf",
                    "title": "Dodoma",
                    "response": "3",
                    "next_menu": ""
                  }
                ],
                "next_menu": "",
                "fail_message": "",
                "previous_menu": "",
                "retry_message": ""
              }
        }
        store.menus[group.next_menu_id].options = organisationUnits.map((organisationUnit, index)=>{
            return {
                "id": organisationUnit.id,
                "title": organisationUnit.displayName.split(' Region').join(''),
                "response": "" + (index+1),
                //"value": organisationUnit.id,
                "next_menu": organisationUnit.id
              }
        });
        //break;
        for(let orgUnit of organisationUnits){
            let dist = districts.filter((organisationUnit)=>{
                return organisationUnit.parent.id == orgUnit.id;
            });
            store.menus[orgUnit.id] = {
                "id": orgUnit.id,
                "type": "ou_options",
                "title": `Wilaya ipi ya ${orgUnit.displayName.split(' Region').join('')}?`,
                "data_id": "",
                "options": dist.map((organisationUnit, index)=>{
                    return {
                        "id": organisationUnit.id,
                        "title": organisationUnit.displayName.split('City Council').join('Mjini').split(' District Council').join(''),
                        "response": "" + (index+1),
                        "value": organisationUnit.id,
                        "next_menu": 'ztZEk9naqEZ3xh5niguZz97xL94xKXL'
                      }
                }),
                "next_menu": "",
                "fail_message": "",
                "previous_menu": "",
                "retry_message": ""
              }
        }
    }
    delete store.menus['kh3b7JAtjn77nd9dfb8jhgmtwBdrOcP6X'];
    delete store.menus['kh3b7JAtjn7i8i8i8i097jhbhgmtwBdrOcP6X'];
    let res = await uploadStore(store);
    console.log(res);
})

