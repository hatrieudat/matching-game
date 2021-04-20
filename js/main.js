//Register Vue star rating
Vue.component('star-rating', VueStarRating.default);

Vue.component('modal', {
    props: ['min', 'sec', 'turns', 'star'],
    template: `
        <div id="myModal" class="modal fade d-block">
            <div class="modal-dialog">
                <div class="modal-content">
                    <label class="modal-header bg-dark">
                        <div class="h5 modal-title text-uppercase fw-bold text-warning">
                            <i class="fas fa-trophy pe-2"></i> Congratulation
                        </div>
                    </label>
                    <div class="modal-body">
                        <div class="d-flex flex-column my-3 ms-2">
                            <div class="p-2">
                                <div class="row fs-5">
                                    <div class="col-1 text-end">
                                        <i class="fas fa-stopwatch"></i>
                                    </div>
                                    <div class="col-3 ps-0">
                                        Time
                                    </div>
                                    <div class="col">
                                        {{ min }} : {{ sec }}
                                    </div>
                                </div> 
                            </div>
                            <div class="p-2">
                                <div class="row fs-5">
                                    <div class="col-1 text-end">
                                        <i class="fas fa-hand-paper"></i> 
                                    </div>
                                    <div class="col-3 ps-0">
                                        Moves
                                    </div>
                                    <div class="col">
                                        {{ turns }}
                                    </div>
                                </div> 
                            </div>
                            <div class="p-2">
                                <div class="row fs-5">
                                    <div class="col-1 text-end">
                                        <i class="fas fa-star"></i> 
                                    </div>
                                    <div class="col-3 ps-0">
                                        Star
                                    </div>
                                    <div class="col">
                                        <star-rating
                                            :max-rating="3"
                                            :rating="star"
                                            :read-only="true"
                                            :show-rating="false"
                                            :increment="0.5"
                                            :star-size="25"
                                            style="margin-top: -5px"
                                        >                    
                                        </star-rating>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" @click="$emit('close')" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `
});

const app = new Vue({
    el: '#app',
    data: {
        gameComplete: false,
        flipped_cards: [],
        memory_card: [],
        turns: 0,
        start: false,
        time: {
            minutes: 0,
            seconds: 0,
        },
        linux: [
            {
                name: 'debian',
                img: './image/debian-96.png'
            },
            {
                name: 'centos',
                img: './image/centos-96.png'
            },
            {
                name: 'kali',
                img: './image/kali-linux-96.png'
            },
            {
                name: 'mint',
                img: './image/linux-mint-96.png'
            },
            {
                name: 'ubuntu',
                img: './image/ubuntu-96.png'
            },
            {
                name: 'linux',
                img: './image/linux-96.png'
            }
        ]
    },
    created() {
        this.linux.forEach((distro) => {
            Vue.set(distro, 'isFlipped', false);
            Vue.set(distro, 'isMatched', false);
        });
        const distro_1 = _.cloneDeep(this.linux);
        const distro_2 = _.cloneDeep(this.linux);
        this.memory_card = _.shuffle(this.memory_card.concat(distro_1, distro_2));
    },
    methods: {
        flipCard(distro) {
            if(distro.isMatched || distro.isFlipped || this.flipped_cards.length == 2) {
                return;
            }
            if(!this.start) {
                this.startgame();
            }
            distro.isFlipped = true;
            if(this.flipped_cards.length < 2)
                this.flipped_cards.push(distro);
            if(this.flipped_cards.length == 2)
                this.matchCard(distro);
        },
        matchCard(distro) {
            this.turns++;
            if (this.flipped_cards[0].name === this.flipped_cards[1].name) {
                setTimeout(() => {
                    this.flipped_cards.forEach(distro => distro.isMatched = true);
                    this.flipped_cards.length = 0;
                    if(this.memory_card.every(distro => distro.isMatched == true)) {
                        clearInterval(this.interval);
                        this.gameComplete = true;
                    }
                }, 400);                
            }
            else {
                setTimeout(() => {
                    this.flipped_cards.forEach(distro => distro.isFlipped = false); 
                    this.flipped_cards.length = 0;   
                }, 600);
            }
        },
        startgame() {
            this.tick();
            this.interval = setInterval(this.tick, 1000);
            this.start = true;
        },
        tick() {
            if(this.time.seconds != 59) {
                this.time.seconds++;
                return;
            }
            this.time.minutes++;
            this.time.seconds = 0;
        },
        reset() {
            clearInterval(this.interval);            
            this.linux.forEach((distro) => {
                Vue.set(distro, 'isFlipped', false);
                Vue.set(distro, 'isMatched', false);
            });
            
            this.memory_card.length = 0;
            const distro_1 = _.cloneDeep(this.linux);
            const distro_2 = _.cloneDeep(this.linux);
            this.memory_card = _.shuffle(this.memory_card.concat(distro_1, distro_2));
            
            this.time.seconds = 0;
            this.time.minutes = 0;
            this.start = false;
            this.gameComplete = false;
            this.turns = 0;
            this.flipped_cards.length = 0;
        }
    },
    computed: {
        sec: function() {
            if(this.time.seconds < 10) {
                return '0' + this.time.seconds;
            }
            return this.time.seconds;
        },
        min: function() {
            if(this.time.minutes < 10) {
                return '0' + this.time.minutes;
            }
            return this.time.minutes;
        },
        star: function() {
            if(this.turns <= 8)
                return 3;
            if(this.turns > 8 && this.turns <= 11)
                return 2.5;
            if(this.turns > 11 && this.turns <= 14)
                return 2;
            if(this.turns > 14 && this.turns <= 17)
                return 1.5;
            if(this.turns > 17 && this.turns <= 20)
                return 1;    
            return 0.5;
        }
    },
    updated() {
        const myModal = document.getElementById('myModal');
        if(myModal !== null) {
            const modal = new bootstrap.Modal(myModal, {
                backdrop: 'static',
                keyboard: false
            });
            modal.toggle();
        }
    }
});