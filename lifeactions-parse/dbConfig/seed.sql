delete from app_category_m;
insert into app_category_m(id, category_name, description) values
(1, 'others', null),
(2, 'ott', null),
(3, 'ecommerce', null),
(4, 'browser', null),
(5, 'audio_stream', null),
(6, 'short_video', null);

delete from apps_m;
insert into apps_m(app_id, app_name) values (1, 'others');
insert into apps_m(app_id, packageName) values (2, 'com.sec.android.app.launcher');
insert into apps_m(app_id, app_name, category_id, packageName) values
(3, 'hotstar', 2, 'in.startv.hotstar'),
(4, 'youtube', 2, 'com.google.android.youtube'),
(5, 'netflix', 2, 'com.netflix.mediaclient'),
(6, 'amazon_prime', 2, 'com.amazon.avod.thirdpartyclient'),
(7, 'jio_cinema', 2, 'com.jio.media.ondemand'),
(8, 'flipkart', 3, 'com.flipkart.android'),
(9, 'amazon', 3, 'in.amazon.mShop.android.shopping'),
(10, 'chrome', 4, 'com.android.chrome'),
(11, 'myntra', 3, 'com.myntra.android'),
(12, 'meesho', 3, 'com.meesho.supply'),
(13, 'jiomart', 3, 'com.jpl.jiomart'),
(14, 'sonyliv', 4, 'com.sonyliv'),
(15, 'jiosaavn', 5, 'com.jio.media.jiobeats'),
(16, 'moj', 6, 'in.mohalla.video'),
(17, 'spotify', 5, 'com.spotify.music'),
(18, 'gaana', 5, 'com.gaana'),
(19, 'josh', 6, 'com.eterno.shortvideos'),
(20, 'nykaa', 3, 'com.fsn.nykaa'),
(21, 'hoichoi', 2, 'com.viewlift.hoichoi'),
(22, 'zee5', 2, 'com.graymatrix.did'),
(23, 'voot', 2, 'com.tv.v18.viola'),
(24, 'insta', 6, 'com.instagram.android'),
(25, 'mxplayer', 2, 'com.mxtech.videoplayer.ad');


-- delete from lifeactions.event_info_m;
-- insert into lifeactions.event_info_m(event_info, name) values('com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0', 'navigation');
-- insert into lifeactions.event_info_m(event_info, name) values('com.sec.android.app.launcher*android.widget.ListView*4*32*0', 'navigation');
-- insert into lifeactions.event_info_m(event_info, name) values('com.sec.android.app.launcher*android.widget.TextView*4*1*0', 'app_clicked');
-- insert into lifeactions.event_info_m(event_info, name) values('com.android.systemui*android.widget.FrameLayout*4*32*0', 'phone_screen_lock');
-- insert into lifeactions.event_info_m(app_id, event_info, name) values(3, 'com.google.android.youtube*android.widget.ImageView*4*1*0', 'image_btn_click');
-- insert into lifeactions.event_info_m(app_id, event_info, name) values(3, 'com.google.android.youtube*android.widget.FrameLayout*4*8*0', 'miniplayer_data');
-- insert into lifeactions.event_info_m(app_id, event_info, name) values(3, 'com.google.android.youtube*android.widget.Button*4*4*0', 'button_click');
-- insert into lifeactions.event_info_m(app_id, event_info, name) values(3, 'com.google.android.youtube*android.widget.FrameLayout*4*1*0', 'tile_clicked');
-- insert into lifeactions.event_info_m(app_id, event_info, name) values(3, 'com.google.android.youtube*android.widget.EditText*4*8192*0', 'input_box');
-- insert into lifeactions.event_info_m(app_id, event_info, name) values(2, 'in.startv.hotstar*android.widget.FrameLayout*4*1*0', 'tile_clicked');
-- insert into lifeactions.event_info_m(app_id, event_info, name) values(2, 'in.startv.hotstar*android.view.ViewGroup*4*1*0', 'btn_clicked');
-- insert into lifeactions.event_info_m(app_id, event_info, name) values(2, 'in.startv.hotstar*android.widget.EditText*4*8192*0', 'input_box');
-- insert into lifeactions.event_info_m(app_id, event_info, name) values(2, 'in.startv.hotstar*in.startv.hotstar.rocky.home.search.SearchActivity*4*32*0', 'search_box');
-- insert into lifeactions.event_info_m(app_id, event_info, name) values(2, 'in.startv.hotstar*android.widget.RelativeLayout*4*1*0', 'window');
-- insert into lifeactions.event_info_m(app_id, event_info, name) values(2, 'in.startv.hotstar*in.startv.hotstar.rocky.launch.splash.SplashActivity*4*32*0', 'app_opened');
-- insert into lifeactions.event_info_m(app_id, event_info, name) values(2, 'in.startv.hotstar*android.widget.TextView*4*1*0', 'text_clicked');

-- delete from lifeactions.data_patterns_m;
-- insert into lifeactions.data_patterns_m(name, event_info)
-- values('app_launch', 'com.sec.android.app.launcher*android.widget.TextView*4*1*0');
-- insert into lifeactions.data_patterns_m(name, event_info, data)
-- values('phone_home_screen', 'com.sec.android.app.launcher*com.android.launcher3.uioverrides.QuickstepLauncher*4*32*0', 'Home');
-- insert into lifeactions.data_patterns_m(name, event_info, data)
-- values('recent_apps_clicked', 'com.sec.android.app.launcher*android.widget.ListView*4*32*0', 'Recent apps');
-- insert into lifeactions.data_patterns_m(name, event_info, data)
-- values('lock_screen', 'com.android.systemui*android.widget.FrameLayout*4*32*0', 'Lock screen');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info, data)
-- values(3, 'play_video', 'com.google.android.youtube*android.widget.ImageView*4*1*0', 'Play video');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info, data)
-- values(3, 'pause_video', 'com.google.android.youtube*android.widget.ImageView*4*1*0', 'Pause video');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info, data)
-- values(3, 'search_box_clicked', 'com.google.android.youtube*android.widget.ImageView*4*1*0', 'Search');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info)
-- values(3, 'search_text', 'com.google.android.youtube*android.widget.EditText*4*8192*0');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info, data)
-- values(3, 'ad_closed', 'com.google.android.youtube*android.widget.ImageView*4*1*0', 'Close ad panel');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info, data)
-- values(3, 'miniplayer_closed', 'com.google.android.youtube*android.widget.ImageView*4*1*0', 'Close miniplayer');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info, suffix)
-- values(3, 'miniplayer_video_title', 'com.google.android.youtube*android.widget.FrameLayout*4*8*0', ', Pause video');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info, prefix)
-- values(3, 'miniplayer_video_channel', 'com.google.android.youtube*android.widget.FrameLayout*4*8*0', 'Close miniplayer, ');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info, suffix)
-- values(3, 'video_title', 'com.google.android.youtube*android.widget.FrameLayout*4*1*0', ', More, ');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info, prefix, suffix)
-- values(3, 'video_views', 'com.google.android.youtube*android.widget.FrameLayout*4*1*0', ', More, ', ' · ');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info, prefix)
-- values(3, 'video_uploaded', 'com.google.android.youtube*android.widget.FrameLayout*4*1*0',' · ');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info, prefix)
-- values(2, 'movie_tile_clicked', 'in.startv.hotstar*android.widget.FrameLayout*4*1*0', 'Movie Name');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info, data)
-- values(2, 'watch_movie', 'in.startv.hotstar*android.widget.FrameLayout*4*1*0', 'Watch');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info)
-- values(2, 'search_text', 'in.startv.hotstar*android.widget.EditText*4*8192*0');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info, data)
-- values(2, 'search_box_clicked', 'in.startv.hotstar*in.startv.hotstar.rocky.home.search.SearchActivity*4*32*0', 'Search');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info, data)
-- values(2, 'account_holder', 'in.startv.hotstar*android.widget.RelativeLayout*4*1*0', ', +91');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info)
-- values(2, 'hotstar_app_opened', 'in.startv.hotstar*in.startv.hotstar.rocky.launch.splash.SplashActivity*4*32*0');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info)
-- values(2, 'movie_genre', 'in.startv.hotstar*android.widget.TextView*4*1*0');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info)
-- values(2, 'movie_description', 'in.startv.hotstar*android.widget.FrameLayout*4*1*0');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info, prefix)
-- values(2, 'show_name', 'in.startv.hotstar*android.widget.FrameLayout*4*1*0', 'Show Name');
-- insert into lifeactions.data_patterns_m(app_id, name, event_info, data)
-- values(2, 'watch_movie', 'in.startv.hotstar*android.view.ViewGroup*4*1*0', 'Watch');