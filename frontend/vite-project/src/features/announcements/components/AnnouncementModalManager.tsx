import { useState, useEffect } from 'react';
import { BaseInfoModal } from '../../../components/ui/Modal/BaseInfoModal';
import { ANNOUNCEMENTS } from '../constants/announements';
import { Announcement } from '../types';
import { Button } from '../../../components/ui/Button/Button'; 

export const AnnouncementModalManager = () => {
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. アクティブなお知らせのみを抽出
    const activeAnnouncements = ANNOUNCEMENTS.filter((a) => a.isActive);

    // 2. まだ閲覧していない（localStorageにフラグがない）最初のお知らせを探す
    const unreadAnnouncement = activeAnnouncements.find(
      (a) => localStorage.getItem(`seen_announcement_${a.id}`) !== 'true'
    );

    if (unreadAnnouncement) {
      setCurrentAnnouncement(unreadAnnouncement);
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    if (currentAnnouncement) {
      // 閲覧済みのフラグを保存
      localStorage.setItem(`seen_announcement_${currentAnnouncement.id}`, 'true');
    }
    setIsOpen(false);
  };

  if (!currentAnnouncement) return null;

  return (
    <BaseInfoModal
      isOpen={isOpen}
      onClose={handleClose}
      title={currentAnnouncement.title}
    >
      <div>
        {currentAnnouncement.content}
        
        {/* フッターの確認ボタン領域 */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Button onClick={handleClose}>
            確認しました
          </Button>
        </div>
      </div>
    </BaseInfoModal>
  );
};