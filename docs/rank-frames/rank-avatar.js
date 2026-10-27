/* Reading Rally rank-avatar.js | No dependencies. Static PNG + optional CSS FX. */
(function (global) {
 'use strict';
 const ranks = {"version": "1.0.0", "ranks": [{"rank": "E", "minScore": 0, "src": "frames/rank-e.png", "width": 1254, "height": 1254, "photo": {"left": 15.7895, "top": 17.3046, "width": 68.2616, "height": 63.9553, "clipPath": "polygon(0.000% 91.771%,0.000% 8.105%,0.117% 7.357%,0.234% 6.858%,0.467% 5.985%,0.701% 5.362%,1.168% 4.364%,1.636% 3.616%,3.388% 1.746%,4.439% 0.998%,5.140% 0.623%,6.192% 0.249%,6.659% 0.125%,7.477% 0.000%,92.290% 0.000%,93.107% 0.125%,94.042% 0.374%,94.743% 0.623%,95.444% 0.998%,96.145% 1.496%,96.612% 1.870%,98.131% 3.491%,98.481% 3.990%,98.715% 4.364%,99.182% 5.362%,99.650% 6.858%,99.883% 8.105%,99.883% 21.820%,99.766% 91.771%,99.650% 92.768%,99.533% 93.267%,99.065% 94.763%,98.949% 95.012%,98.598% 95.636%,98.248% 96.135%,96.262% 98.254%,95.911% 98.504%,94.276% 99.377%,93.341% 99.626%,92.757% 99.751%,90.421% 99.875%,89.603% 99.875%,6.893% 99.751%,6.308% 99.626%,5.841% 99.501%,5.140% 99.252%,4.206% 98.753%,3.505% 98.254%,2.921% 97.756%,1.986% 96.758%,1.519% 96.135%,1.285% 95.761%,0.935% 95.137%,0.584% 94.389%,0.350% 93.641%,0.117% 92.768%)"}, "accent": "#8b96a6", "sparkles": 0, "animate": false, "alphaQA": {"center": 0, "outerCorner": 0, "transparentPixelFraction": 0.6878}}, {"rank": "D", "minScore": 50, "src": "frames/rank-d.png", "width": 1254, "height": 1254, "photo": {"left": 19.378, "top": 16.7464, "width": 61.4833, "height": 59.4099, "clipPath": "polygon(0.000% 82.685%,0.000% 8.322%,0.130% 7.383%,0.259% 6.846%,0.389% 6.443%,0.778% 5.503%,1.167% 4.698%,1.427% 4.295%,1.816% 3.758%,3.632% 1.879%,4.410% 1.342%,5.058% 0.940%,5.966% 0.537%,6.744% 0.268%,7.393% 0.134%,9.857% 0.000%,90.921% 0.000%,92.218% 0.134%,92.866% 0.268%,93.256% 0.403%,93.904% 0.671%,95.201% 1.342%,95.590% 1.611%,96.109% 2.013%,97.665% 3.624%,98.054% 4.161%,98.314% 4.564%,99.092% 6.174%,99.351% 6.980%,99.481% 7.517%,99.611% 8.322%,99.741% 20.134%,99.870% 70.201%,99.870% 73.020%,99.611% 82.416%,99.092% 82.953%,87.030% 95.302%,80.934% 99.866%,18.547% 99.866%,12.322% 95.302%,0.519% 83.221%)"}, "accent": "#42a161", "sparkles": 0, "animate": false, "alphaQA": {"center": 0, "outerCorner": 0, "transparentPixelFraction": 0.6677}}, {"rank": "C", "minScore": 100, "src": "frames/rank-c.png", "width": 1254, "height": 1254, "photo": {"left": 17.5439, "top": 17.7033, "width": 64.992, "height": 61.9617, "clipPath": "polygon(0.000% 79.151%,0.000% 12.484%,0.123% 11.840%,0.368% 11.068%,0.613% 10.553%,1.104% 9.781%,1.963% 8.880%,10.429% 0.901%,10.798% 0.644%,11.411% 0.386%,11.779% 0.257%,12.270% 0.129%,27.239% 0.000%,77.669% 0.000%,89.448% 0.129%,90.061% 0.257%,90.429% 0.386%,91.656% 1.030%,92.147% 1.416%,92.883% 2.059%,93.497% 2.703%,98.650% 8.880%,98.896% 9.266%,99.387% 10.296%,99.632% 11.068%,99.755% 11.712%,99.877% 13.256%,99.877% 78.250%,99.755% 79.151%,93.006% 94.208%,92.515% 94.852%,91.534% 96.010%,89.448% 98.198%,88.589% 98.970%,88.098% 99.356%,87.607% 99.614%,87.239% 99.743%,86.748% 99.871%,21.350% 99.871%,6.748% 88.546%,6.258% 88.031%)"}, "accent": "#39d6ff", "sparkles": 2, "animate": true, "alphaQA": {"center": 0, "outerCorner": 0, "transparentPixelFraction": 0.5577}}, {"rank": "B", "minScore": 150, "src": "frames/rank-b.png", "width": 1254, "height": 1254, "photo": {"left": 17.4641, "top": 18.74, "width": 66.2679, "height": 60.2871, "clipPath": "polygon(83.273% 99.868%,22.262% 99.735%,21.901% 99.603%,15.764% 96.429%,14.801% 95.899%,12.996% 94.841%,12.395% 94.444%,10.229% 92.725%,9.266% 91.931%,6.980% 89.815%,6.619% 89.418%,4.934% 87.434%,3.129% 85.185%,0.602% 81.878%,0.361% 81.481%,0.241% 81.217%,0.120% 79.894%,0.000% 63.492%,0.000% 17.593%,0.120% 16.667%,0.361% 15.873%,0.481% 15.608%,0.722% 15.212%,2.166% 13.624%,13.357% 5.688%,13.959% 5.291%,14.922% 4.762%,18.893% 2.778%,20.939% 1.984%,23.466% 1.058%,25.391% 0.397%,25.872% 0.265%,26.474% 0.132%,31.649% 0.000%,81.949% 0.000%,91.937% 0.265%,92.659% 0.397%,93.141% 0.529%,93.863% 0.794%,95.307% 1.587%,96.751% 2.778%,97.473% 3.571%,98.676% 5.291%,99.278% 6.614%,99.519% 7.407%,99.759% 8.730%,99.880% 10.317%,99.880% 13.360%,99.759% 87.434%,99.639% 88.624%,99.519% 89.683%,98.075% 93.651%,97.353% 94.841%,95.668% 96.693%,93.381% 98.810%,93.020% 98.942%,90.854% 99.471%,87.244% 99.868%)"}, "accent": "#c67cff", "sparkles": 3, "animate": true, "alphaQA": {"center": 0, "outerCorner": 0, "transparentPixelFraction": 0.5211}}, {"rank": "A", "minScore": 200, "src": "frames/rank-a.png", "width": 1254, "height": 1254, "photo": {"left": 20.4944, "top": 18.5805, "width": 59.0909, "height": 55.8214, "clipPath": "polygon(99.865% 11.857%,99.865% 72.714%,99.730% 73.143%,93.117% 91.714%,86.370% 99.286%,85.965% 99.714%,85.695% 99.857%,14.035% 99.857%,13.495% 99.286%,7.018% 92.286%,6.748% 91.857%,0.135% 73.143%,0.000% 55.714%,0.000% 12.571%,0.135% 11.286%,0.270% 10.286%,0.540% 9.143%,0.675% 8.714%,2.024% 5.857%,2.429% 5.286%,4.723% 2.857%,5.398% 2.286%,6.208% 1.714%,7.557% 1.000%,9.177% 0.429%,9.852% 0.286%,10.661% 0.143%,11.876% 0.000%,80.027% 0.000%,89.339% 0.143%,90.148% 0.286%,90.823% 0.429%,91.768% 0.714%,92.173% 0.857%,92.848% 1.143%,93.117% 1.286%,94.197% 2.000%,95.007% 2.571%,97.436% 5.143%,97.841% 5.714%,98.111% 6.143%,98.650% 7.143%,98.785% 7.429%,99.190% 8.429%,99.460% 9.286%,99.595% 9.857%,99.730% 10.714%)"}, "accent": "#b8efff", "sparkles": 4, "animate": true, "alphaQA": {"center": 0, "outerCorner": 0, "transparentPixelFraction": 0.4744}}, {"rank": "S", "minScore": 250, "src": "frames/rank-s.png", "width": 1254, "height": 1254, "photo": {"left": 21.4514, "top": 24.0829, "width": 57.0973, "height": 50.9569, "clipPath": "polygon(0.000% 81.847%,0.000% 8.451%,0.279% 7.825%,0.698% 7.042%,1.397% 5.947%,4.190% 2.817%,5.028% 2.034%,5.726% 1.408%,6.983% 0.469%,7.263% 0.313%,7.682% 0.156%,16.201% 0.000%,89.525% 0.000%,92.179% 0.156%,92.598% 0.313%,93.296% 0.782%,94.134% 1.408%,95.950% 3.130%,97.207% 4.538%,98.603% 6.260%,99.441% 7.668%,99.721% 8.294%,99.860% 8.920%,99.860% 82.003%,99.581% 82.473%,96.508% 86.854%,96.089% 87.324%,87.011% 96.714%,82.263% 99.218%,6.704% 99.844%,6.564% 99.844%,6.145% 99.374%)"}, "accent": "#ffdd3c", "sparkles": 5, "animate": true, "alphaQA": {"center": 0, "outerCorner": 0, "transparentPixelFraction": 0.4854}}, {"rank": "SSS", "minScore": 300, "src": "frames/rank-sss.png", "width": 1254, "height": 1254, "photo": {"left": 21.6906, "top": 26.874, "width": 56.6188, "height": 49.6013, "clipPath": "polygon(92.113% 99.839%,7.746% 99.839%,6.761% 98.875%,0.563% 91.801%,0.423% 90.675%,0.000% 40.836%,0.000% 39.550%,0.141% 6.592%,0.282% 5.627%,0.563% 4.662%,1.127% 3.376%,1.549% 2.733%,2.394% 1.768%,3.099% 1.125%,3.944% 0.643%,5.211% 0.161%,62.676% 0.000%,63.239% 0.000%,94.507% 0.161%,95.211% 0.322%,95.915% 0.643%,96.479% 0.965%,96.901% 1.286%,98.732% 3.376%,99.296% 4.662%,99.577% 5.627%,99.718% 6.752%,99.859% 25.563%,99.859% 26.849%,99.577% 81.833%,99.296% 91.640%,99.155% 91.961%,92.958% 99.035%)"}, "accent": "#ffc83d", "sparkles": 6, "animate": true, "alphaQA": {"center": 0, "outerCorner": 0, "transparentPixelFraction": 0.4714}}, {"rank": "Legendary", "minScore": 350, "src": "frames/rank-legendary.png", "width": 1254, "height": 1254, "photo": {"left": 24.0829, "top": 27.3525, "width": 51.9139, "height": 49.8405, "clipPath": "polygon(99.846% 7.200%,99.846% 80.960%,99.693% 81.280%,99.232% 81.920%,98.310% 82.880%,97.389% 83.680%,96.928% 84.000%,96.621% 84.160%,65.899% 99.840%,65.284% 99.840%,40.399% 97.280%,0.922% 83.040%,0.614% 82.880%,0.154% 82.400%,0.000% 81.920%,0.000% 7.360%,0.154% 6.560%,0.307% 5.920%,0.614% 5.120%,0.922% 4.480%,1.382% 3.680%,3.379% 1.600%,3.840% 1.280%,5.069% 0.640%,6.452% 0.160%,83.257% 0.000%,91.551% 0.000%,92.934% 0.160%,93.702% 0.320%,94.163% 0.480%,94.931% 0.800%,96.160% 1.440%,98.157% 3.520%,98.771% 4.320%,99.078% 4.800%,99.386% 5.600%,99.693% 6.560%)"}, "accent": "#efadff", "sparkles": 6, "animate": true, "alphaQA": {"center": 0, "outerCorner": 0, "transparentPixelFraction": 0.409}}]}.ranks;
 function getRank(score) {
   const n = Number(score);
   return ranks[Math.min(7, Math.max(0, Math.floor((Number.isFinite(n) ? n : 0) / 50)))].rank;
 }
 function mount(element, options = {}) {
   const rank = options.rank || getRank(options.score || 0);
   const asset = ranks.find(x => x.rank.toLowerCase() === String(rank).toLowerCase()) || ranks[0];
   const size = Math.max(32, Number(options.size) || 160);
   const name = options.name || 'ผู้เล่น';
   const root = document.createElement('span');
   root.className = 'rr-avatar' + (options.motion === false ? '' : ' rr-animated');
   root.dataset.rank = asset.rank;
   root.dataset.small = String(size < 96);
   root.setAttribute('role', 'img');
   root.setAttribute('aria-label', name + ' · Rank ' + asset.rank);
   root.style.cssText = '--size:' + size + 'px;--accent:' + asset.accent;
   const photo = document.createElement('span');
   photo.className = 'rr-photo';
   Object.assign(photo.style, {
     left:asset.photo.left+'%', top:asset.photo.top+'%',
     width:asset.photo.width+'%', height:asset.photo.height+'%',
     clipPath:asset.photo.clipPath
   });
   const fallback=document.createElement('span');
   fallback.className='rr-fallback'; fallback.textContent=(options.initials || name.slice(0,2)).slice(0,3);
   photo.appendChild(fallback);
   if(options.photoUrl) {
     const image=document.createElement('img'); image.alt='';
     image.decoding='async'; image.referrerPolicy='no-referrer';
     image.src=options.photoUrl;
     image.addEventListener('error',()=>image.remove(),{once:true});
     photo.appendChild(image);
   }
   root.appendChild(photo);
   const frame=document.createElement('img'); frame.className='rr-frame'; frame.alt='';
   frame.draggable=false; frame.decoding='async';
   frame.src=(options.assetBase || './')+asset.src;
   root.appendChild(frame);
   const points=[[18,18],[81,24],[82,72],[20,81],[50,12],[67,86]];
   for(let i=0;i<asset.sparkles;i++) {
     const star=document.createElement('span'); star.className='rr-spark';
     star.setAttribute('aria-hidden','true');
     star.style.cssText='left:'+points[i][0]+'%;top:'+points[i][1]+'%;--delay:'+(-i*.71)+'s;--star-size:'+(i%2?4:6)+'%;';
     root.appendChild(star);
   }
   element.replaceChildren(root);
   return root;
 }
 global.ReadingRallyFrames={ranks,getRank,mount};
})(window);
