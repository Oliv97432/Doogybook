import React, { useEffect } from 'react';

const AdSense = ({ 
  adClient, 
  adSlot, 
  adFormat = 'auto', 
  adLayout = '', 
  adStyle = {} 
}) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || [])?.push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: 'block',
        ...adStyle
      }}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-ad-layout={adLayout}
      data-full-width-responsive="true"
    />
  );
};

export default AdSense;