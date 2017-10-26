import { Component, OnInit, SecurityContext, Input, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router} from '@angular/router';

@Component({
  selector: 'app-memories',
  templateUrl: './memories.component.html',
  styleUrls: ['./memories.component.css']
})

export class MemoriesComponent implements OnInit {
    @Input() myColor;
    @Input() myBgColor;
    @Input() inLogin;
    @Input() isLoggedIn;
    @Input() memColor;
    @Input() hideOptions;
    @Output() emitMemories = new EventEmitter();
    @Output() emitMemory = new EventEmitter();

    memory: Memory;
    memories =[];
    myTags = [];
    tags: Tags;
    dataUrl: string;
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    sortedMemories = [];
    screenWidth: any;
    
        
    constructor(public http: Http, private sanitizer: DomSanitizer, private router: Router) {
        
    }

    refreshData(ev) {
          this.processJson();
    }

    gotomem(idx: number) {
        this.emitMemory.emit(idx);
    }

    hoverIn(index: any) {
        let junk = document.getElementById(index);
        document.getElementById(junk.id).style.color = this.myBgColor;
        document.getElementById(junk.id).style.background = this.myColor;            
    }
    hoverOut(index: any) {
        let junk = document.getElementById(index);
        document.getElementById(junk.id).style.color = this.myColor;
        document.getElementById(junk.id).style.background = this.myBgColor;
    }

    getposts() {
        this.dataUrl = "https://api.onedrive.com/v1.0/shares/u!" + btoa("https://1drv.ms/u/s!AmQasIRCiDf9vTVJ0_dCvaClKKxy?v="+Math.random())+"/root?expand=children";
        console.log("first: "+this.dataUrl);
        //open the above link and copy the token url from there.


        // FOR PRODUCTION
        //this.dataUrl = "https://ccipua.bn1301.livefilestore.com/y4m4OT3IWZ1c_X434Cbn1Si4hVwmspmqHXwHJshlw1tEzR77XT4CQgw6esmptEfWc6ubDvOeYEK8Rh5-DJw67AioJ2zvCIYWYUqaeyjv4xPCLkfrpGunqL7kzwb3pQT4CRvHSCmQAyEc_sQPuLhmh1SKAMojy-ROxb_n0mFy1wR6Y2hF0FVVCXGAmmaGiQZmksCjKVEx_ObT4tQN8YOVymzbQ";



        //FOR LOCAL
        this.dataUrl = "https://hmulza.bn1301.livefilestore.com/y4mlmlKyZB5vhhXOGrUqXnyDLAOeT3pIl8dwcTzO6fTvwnZD_3QmdRv65XDLqUkNroyNDl8sHgOvDoLsmhtGjtElxjFO0vdfy0JbyaypXxZ8aH8PCFUMAYDrk_5jASxMjg9Z9FJIG3KCs2S0jqXwg1JtfY_qYPny7ypeQW1CEjFQDVIC3mwXKe2Vgc8LZfSZjW220OhOj2n5-j94Ll3bhbc5g";

        //WORKING ONE; just need to calculate random value online; need to generate this url automatically everytime;
        //this.dataUrl = "https://hmulza.bn1301.livefilestore.com/y4mYs5TXoSjm5MzPcgpfq3PfWhaY34tB3Phb5ozTGzXUvaEL3rWSDa-rb-xLLcSqLAbv6L5YUXQ-cGP2dZiaHRY43QNXd-WvAKZV0qT4yhTTyFyz8IpU_v-atyXml1kunX7lDPTDb8ZJXvDDGDPP5ojS7IjAbFKwb8pTZEah81COoWuRCY4zAVCOAzTBRHMR7juP3hjN7cDZaBZoYsa4iGBnw";
        
        return this.http.get(this.dataUrl).map(res => res.json());
    }

    preprocessJson() {
        this.getposts().subscribe((genUrl) => {
            console.log(genUrl);
        })
    }

    processJson() {
        //this.preprocessJson();
        //this.dataUrl = "https://hmulza.bn1301.livefilestore.com/y4mlmlKyZB5vhhXOGrUqXnyDLAOeT3pIl8dwcTzO6fTvwnZD_3QmdRv65XDLqUkNroyNDl8sHgOvDoLsmhtGjtElxjFO0vdfy0JbyaypXxZ8aH8PCFUMAYDrk_5jASxMjg9Z9FJIG3KCs2S0jqXwg1JtfY_qYPny7ypeQW1CEjFQDVIC3mwXKe2Vgc8LZfSZjW220OhOj2n5-j94Ll3bhbc5g";
        this.memories = [];
        this.sortedMemories = [];
        this.getposts().subscribe((posts) => {
            for(var i = 0; i < posts.length; i++){
                this.memory = posts[i];
                this.tags = {
                    name: this.memory.title
                }
                this.myTags.push(this.tags.name);
                this.memory.content = this.sanitizer.bypassSecurityTrustHtml(this.memory.content);
                this.memories.push(this.memory);
            }
            let cnt = 0;
            for(let i = 2015; i < 2064; i++)
                for(let j = 0; j < 12; j++)
                    for(let k = 1; k < 32; k++)
                        for(let x = 0; x < this.memories.length; x++){
                            let date = this.memories[x].time.split(" ");
                            if(parseInt(date[0]) == k && date[1] == this.months[j] && parseInt(date[2]) == i){
                                let hide = false;
                                for(let y = 0; y < this.memories[x].tags.length; y++)
                                    if(this.memories[x].tags[y] == "personal" && !this.isLoggedIn)
                                        hide = true;
                                if(!hide)
                                    this.sortedMemories.unshift(this.memories[x]);
                            }
                        }
            this.emitMemories.emit(this.sortedMemories);
            let curUrl = (window.location+'').split('/');
            let idx = parseInt(curUrl[curUrl.length-1]);
            if(curUrl.length >= 5)
                this.gotomem(idx);
        })
    }
    ngOnInit() {
        this.processJson();
        this.screenWidth = window.screen.width;
    }
}
interface Memory {
    title: string;
    content: any;
    time: string;
    tags: Array<string>;
}
interface Tags {
    name: string;
}