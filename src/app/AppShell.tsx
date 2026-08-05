import { AppShell, Container, Group, Text, UnstyledButton } from '@mantine/core';
import { NavLink, Outlet } from 'react-router-dom';
import classes from './AppShell.module.css';

const TABS = [
  { to: '/', label: 'Log', icon: '🍽️', end: true },
  { to: '/foods', label: 'Foods', icon: '🥕', end: false },
  { to: '/goal', label: 'Goal', icon: '🎯', end: false },
  { to: '/reminders', label: 'Reminders', icon: '⏰', end: false },
  { to: '/profile', label: 'Profile', icon: '👤', end: false },
];

export function AppLayout() {
  return (
    <AppShell header={{ height: 56 }} footer={{ height: 64 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Text fw={700} c="teal">
            NutriView
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="sm" px={0}>
          <Outlet />
        </Container>
      </AppShell.Main>

      <AppShell.Footer>
        <Group h="100%" gap={0} grow>
          {TABS.map((tab) => (
            <UnstyledButton
              key={tab.to}
              component={NavLink}
              to={tab.to}
              end={tab.end}
              className={classes.tab}
            >
              <span className={classes.icon}>{tab.icon}</span>
              <Text size="xs">{tab.label}</Text>
            </UnstyledButton>
          ))}
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
}
