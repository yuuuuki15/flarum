import { extend } from 'flarum/extend';
import app from 'flarum/app';
import UserControls from 'flarum/utils/UserControls';
import Button from 'flarum/components/Button';
import Badge from 'flarum/components/Badge';
import User from 'flarum/models/User';

import SuspendUserModal from './components/SuspendUserModal';
import UserSuspendedNotification from './components/UserSuspendedNotification';
import UserUnsuspendedNotification from './components/UserUnsuspendedNotification';
import checkForSuspension from './checkForSuspension';

export { default as extend } from './extend';

app.initializers.add('flarum-suspend', () => {
  app.notificationComponents.userSuspended = UserSuspendedNotification;
  app.notificationComponents.userUnsuspended = UserUnsuspendedNotification;

  extend(UserControls, 'moderationControls', (items, user) => {
    if (user.canSuspend()) {
      items.add(
        'suspend',
        Button.component(
          {
            icon: 'fas fa-ban',
            onclick: () => app.modal.show(SuspendUserModal, { user }),
          },
          app.translator.trans('flarum-suspend.forum.user_controls.suspend_button')
        )
      );
    }
  });

  extend(User.prototype, 'badges', function (items) {
    const until = this.suspendedUntil();

    if (new Date() < until) {
      items.add(
        'suspended',
        Badge.component({
          icon: 'fas fa-ban',
          type: 'suspended',
          label: app.translator.trans('flarum-suspend.forum.user_badge.suspended_tooltip'),
        })
      );
    }
  });

  checkForSuspension();
});

// Expose compat API
import suspendCompat from './compat';
import { compat } from '@flarum/core/forum';

Object.assign(compat, suspendCompat);
