# Makes the generated Capacitor Android project work on phones AND Android TV / Google TV (TCL, Hisense, Sony...).
import re
p = 'android/app/src/main/AndroidManifest.xml'
s = open(p, encoding='utf-8').read()
feat = (
    '    <uses-feature android:name="android.software.leanback" android:required="false" />\n'
    '    <uses-feature android:name="android.hardware.touchscreen" android:required="false" />\n'
)
if 'leanback' not in s:
    s = s.replace('<application', feat + '    <application', 1)
s = s.replace('<application', '<application android:usesCleartextTraffic="true"', 1) if 'usesCleartextTraffic' not in s else s
# landscape + remote friendly
s = re.sub(r'(<activity\b)', r'\1 android:screenOrientation="sensorLandscape"', s, count=1) if 'screenOrientation' not in s else s
tv = (
    '            <intent-filter>\n'
    '                <action android:name="android.intent.action.MAIN" />\n'
    '                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />\n'
    '            </intent-filter>\n'
)
s = s.replace('</activity>', tv + '        </activity>', 1) if 'LEANBACK_LAUNCHER' not in s else s
open(p, 'w', encoding='utf-8').write(s)
print(s)
